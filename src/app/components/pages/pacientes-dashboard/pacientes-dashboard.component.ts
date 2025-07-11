import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { Paciente } from '../../../models/Paciente';
import { Profesional } from '../../../models/Profesional';
import { ServLoginService } from '../../../services/serv-login.service';
import { ServCitaService } from '../../../services/servicio-cita/serv-cita.service';
import { ServPacientesService } from '../../../services/servicio-paciente/serv-pacientes.service';
import { ServProfesionalesService } from '../../../services/servicio-profesional/serv-profesionales.service';
import { ServResenasService } from '../../../services/servicio-resena/serv-resenas.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ServServiciosjsonService } from '../../../services/servicio-servicios/serv-serviciosjson.service';
import { Cita } from '../../../models/Citas';
import { MatIconModule } from '@angular/material/icon'; 

interface CitaConDetalles extends Cita {
  fechaHoraServicio: Date;
  nombreServicio: string;
  nombreProfesional: string;
  fechaDisponibleServicio: string;
}

interface ProfesionalConPromedio extends Profesional {
  promedioCalificacion?: number;
}

@Component({
  selector: 'app-pacientes-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule 
  ],
  templateUrl: './pacientes-dashboard.component.html',
  styleUrl: './pacientes-dashboard.component.css'
})
export class PacientesDashboardComponent implements OnInit {
 pacienteActual: Paciente | undefined;
  citasProximas: CitaConDetalles[] = [];
  profesionalesDestacados: ProfesionalConPromedio[] = [];

  constructor(
    private login: ServLoginService,
    private servPacientes: ServPacientesService,
    private servCitas: ServCitaService,
    private servResenas: ServResenasService,
    private servProfesionales: ServProfesionalesService,
    private servServicios: ServServiciosjsonService
  ) {}

  ngOnInit(): void {
    this.cargarPacienteYDatos();
    this.cargarProfesionalesDestacados(); // Puedes cargar esto independientemente, si no depende del pacienteActual
  }

  private cargarPacienteYDatos() {
    const idPaciente = String(this.login.getIdentificador());
    // --- DEBUG 1 ---
    console.log('DEBUG: PacientesDashboard - ID del paciente logueado obtenido:', idPaciente);

    if (!idPaciente || idPaciente === 'null' || idPaciente === 'undefined' || idPaciente.trim() === '') {
      console.warn('DEBUG: PacientesDashboard - ID de paciente no encontrado o inválido. No se cargarán datos del paciente ni citas.');
      this.pacienteActual = undefined; // Asegura que no haya paciente si el ID es inválido
      this.citasProximas = []; // Limpia las citas también
      return;
    }

    this.servPacientes.getPacientePorId(idPaciente).subscribe(p => {
      this.pacienteActual = p;
      // --- DEBUG 2 ---
      console.log('DEBUG: PacientesDashboard - Datos del paciente actual cargados:', this.pacienteActual);
      this.cargarProximasCitas(idPaciente);
    }, error => {
      console.error('DEBUG: PacientesDashboard - Error al cargar datos del paciente:', error);
      this.pacienteActual = undefined;
      this.citasProximas = [];
    });
  }

  private cargarProximasCitas(idPaciente: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // --- DEBUG 3 ---
    console.log('DEBUG: PacientesDashboard - Fecha de hoy (medianoche):', hoy);

    // --- DEBUG 4: Observar la cadena de suscripciones anidadas ---
    this.servCitas.getCitas().subscribe(citas => {
      console.log('DEBUG: PacientesDashboard - Citas recibidas del backend (todas):', citas);

      this.servServicios.getAllServices().subscribe(servicios => {
        console.log('DEBUG: PacientesDashboard - Servicios recibidos del backend (todos):', servicios);

        this.servProfesionales.getProfesionales().subscribe(profesionales => {
          console.log('DEBUG: PacientesDashboard - Profesionales recibidos del backend (todos):', profesionales);

          const citasFiltradasInicial = citas.filter(cita => {
            // --- DEBUG 5: Verificación del ID del paciente en el filtro ---
            const match = String(cita.pacienteId) === String(idPaciente); // Convertir a String para asegurar la comparación
            if (!match) {
              console.log(`DEBUG: Cita descartada - ID de paciente no coincide: Cita.pacienteId='${cita.pacienteId}' vs LoggedInId='${idPaciente}'`);
            }
            return match;
          });
          console.log('DEBUG: Citas filtradas por ID del paciente:', citasFiltradasInicial);

          this.citasProximas = citasFiltradasInicial
            .map(cita => {
              const servicio = servicios.find(s => s.id === cita.servicioId);
              // Asumiendo que cita.profesionalId es más fiable que servicio?.profesionalId
              const profesional = profesionales.find(p => p.id === cita.profesionalId); 

              // --- DEBUG 6: Verificación de servicio y profesional encontrados ---
              if (!servicio) {
                console.log('DEBUG: Cita descartada en map - Servicio no encontrado para cita.servicioId:', cita.servicioId, 'Cita:', cita);
                return null;
              }
              if (!profesional) {
                console.log('DEBUG: Cita descartada en map - Profesional no encontrado para cita.profesionalId:', cita.profesionalId, 'Cita:', cita);
                return null;
              }

              // --- DEBUG 7: Verificación de fechaDisponible del servicio ---
              let fechaHoraServicio: Date | null = null;
              if (servicio.fechaDisponible) {
                fechaHoraServicio = new Date(servicio.fechaDisponible);
                if (isNaN(fechaHoraServicio.getTime())) { // Comprobar si es una fecha inválida
                  console.warn('DEBUG: Fecha de servicio inválida para cita:', cita.id, 'Servicio ID:', servicio.id, 'Fecha:', servicio.fechaDisponible);
                  return null;
                }
              } else {
                console.log('DEBUG: Cita descartada en map - Servicio no tiene fechaDisponible:', servicio.id, 'Cita:', cita);
                return null;
              }

              // Solo si todo es válido, mapear
              if (servicio && profesional && fechaHoraServicio) {
                return {
                  ...cita,
                  fechaHoraServicio: fechaHoraServicio,
                  nombreServicio: servicio.nombre,
                  nombreProfesional: profesional.nombre,
                  fechaDisponibleServicio: servicio.fechaDisponible // Mantener si aún lo usas en el HTML
                } as CitaConDetalles;
              }
              console.log(this.citasProximas);
              
              return null; // Si alguna condición falla, devuelve null para filtrar después
            })
            .filter((cita): cita is CitaConDetalles => {
              // --- DEBUG 8: Último filtro por fecha ---
              const isUpcoming = cita !== null && cita.fechaHoraServicio >= hoy;
              if (cita && !isUpcoming) {
                console.log(`DEBUG: Cita descartada por fecha - Cita.fechaHoraServicio='${cita.fechaHoraServicio?.toISOString()}' vs Hoy='${hoy.toISOString()}'`);
              }
              return isUpcoming;
            })
            .sort((a, b) => a.fechaHoraServicio.getTime() - b.fechaHoraServicio.getTime());
          // --- DEBUG 9: Resultado final ---
          console.log('DEBUG: Citas próximas CON DETALLES (final):', this.citasProximas);
        }, error => {
          console.error('DEBUG: PacientesDashboard - Error al obtener profesionales:', error);
          this.citasProximas = [];
        });
      }, error => {
        console.error('DEBUG: PacientesDashboard - Error al obtener servicios:', error);
        this.citasProximas = [];
      });
    }, error => {
      console.error('DEBUG: PacientesDashboard - Error al obtener citas:', error);
      this.citasProximas = [];
    });
  }

  // El resto de tu código, incluyendo cargarProfesionalesDestacados y isValidId
  private cargarProfesionalesDestacados() {
// 1. Obtener TODAS las reseñas usando el método searchResenas
    this.servResenas.searchResenas('').subscribe(resenas => { // <-- ¡Aquí el cambio principal!
      const calificacionesPorProfesional: { [id: string]: number[] } = {};

      resenas.forEach(r => {
        if (r.profesionalId) {
          if (!calificacionesPorProfesional[r.profesionalId]) {
            calificacionesPorProfesional[r.profesionalId] = [];
          }
          calificacionesPorProfesional[r.profesionalId].push(r.calificacion);
        }
      });

      // Calcular los promedios
      const promediosCalificacion: { [profesionalId: string]: number } = {};
      Object.entries(calificacionesPorProfesional).forEach(([id, calificaciones]) => {
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        promediosCalificacion[id] = calificaciones.length > 0 ? suma / calificaciones.length : 0;
      });

      // 2. Obtener todos los profesionales
      this.servProfesionales.getProfesionales().subscribe(profesionales => {
        // 3. Mapear profesionales y asignar su promedio de calificación
        const profesionalesConPromedio = profesionales.map(profesional => ({
          ...profesional,
          promedioCalificacion: promediosCalificacion[profesional.id!] || 0 // Usar el promedio calculado
        }));

        // 4. Ordenar y seleccionar los 3 mejores
        this.profesionalesDestacados = profesionalesConPromedio
          .sort((a, b) => (b.promedioCalificacion || 0) - (a.promedioCalificacion || 0))
          .slice(0, 3);
      });
    });
  }

  // --- Función auxiliar para validar IDs (puede ser que ya la tengas) ---
  private isValidId(id: string): boolean {
    return id !== null && id !== 'null' && id !== 'undefined' && id.trim() !== '';
  }
}