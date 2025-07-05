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
    MatIconModule // Añade MatIconModule a los imports
  ],
  templateUrl: './pacientes-dashboard.component.html',
  styleUrl: './pacientes-dashboard.component.css'
})
export class PacientesDashboardComponent implements OnInit {
  pacienteActual: Paciente | undefined;
  citasProximas: CitaConDetalles[] = [];
  profesionalesDestacados: ProfesionalConPromedio[] = [];
  private promediosCalificacion: { [profesionalId: string]: number } = {};

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
  }

  private cargarPacienteYDatos() {
    const idPaciente = String(this.login.getIdentificador());

    if (!idPaciente) {
      console.warn('ID de paciente no encontrado');
      return;
    }

    this.servPacientes.getPacientePorId(idPaciente).subscribe(p => {
      this.pacienteActual = p;
      this.cargarProximasCitas(idPaciente);
    });

    this.cargarProfesionalesDestacados();
  }

  private cargarProximasCitas(idPaciente: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.servCitas.getCitas().subscribe(citas => {
      this.servServicios.getAllServices().subscribe(servicios => {
        this.servProfesionales.getProfesionales().subscribe(profesionales => {
          this.citasProximas = citas
            .filter(cita => cita.pacienteId === idPaciente)
            .map(cita => {
              const servicio = servicios.find(s => s.id === cita.servicioId);
              const profesional = profesionales.find(p => p.id === servicio?.profesionalId);

              if (servicio && profesional && servicio.fechaDisponible) {
                return {
                  ...cita,
                  fechaHoraServicio: new Date(servicio.fechaDisponible),
                  nombreServicio: servicio.nombre,
                  nombreProfesional: profesional.nombre,
                  fechaDisponibleServicio: servicio.fechaDisponible
                } as CitaConDetalles;
              }
              return null;
            })
            .filter((cita): cita is CitaConDetalles => cita !== null && cita.fechaHoraServicio >= hoy)
            .sort((a, b) => a.fechaHoraServicio.getTime() - b.fechaHoraServicio.getTime());

          console.log('Citas próximas con detalles:', this.citasProximas);
        });
      });
    });
  }


  private cargarProfesionalesDestacados() {
    this.servResenas.getResenas().subscribe(resenas => {
      const calificacionesPorProfesional: { [id: string]: number[] } = {};

      resenas.forEach(r => {
        if (r.profesionalId) {
          if (!calificacionesPorProfesional[r.profesionalId]) {
            calificacionesPorProfesional[r.profesionalId] = [];
          }
          calificacionesPorProfesional[r.profesionalId].push(r.calificacion);
        }
      });

      const promedioPorProfesional = Object.entries(calificacionesPorProfesional).map(([id, calificaciones]) => {
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        this.promediosCalificacion[id] = calificaciones.length > 0 ? suma / calificaciones.length : 0;
        return { id, promedio: this.promediosCalificacion[id] };
      });

      promedioPorProfesional.sort((a, b) => b.promedio - a.promedio);

      const topProfesionalesIds = promedioPorProfesional.slice(0, 3).map(p => p.id);

      this.servProfesionales.getProfesionales().subscribe(profesionales => {
        this.profesionalesDestacados = profesionales.map(profesional => ({
          ...profesional,
          promedioCalificacion: this.obtenerPromedioProfesional(profesional.id!)
        }));
        this.profesionalesDestacados.sort((a, b) => (b.promedioCalificacion || 0) - (a.promedioCalificacion || 0));
        this.profesionalesDestacados = this.profesionalesDestacados.slice(0, 3);
      });
    });
  }

  obtenerPromedioProfesional(profesionalId: string): number {
    return this.promediosCalificacion[profesionalId] || 0;
  }
}