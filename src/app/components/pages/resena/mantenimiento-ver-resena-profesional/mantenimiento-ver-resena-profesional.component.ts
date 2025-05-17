import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resena } from '../../../../models/Resena';
import { ServResenasService } from '../../../../services/servicio-resena/serv-resenas.service';
import { ServPacientesService } from '../../../../services/servicio-paciente/serv-pacientes.service';
import { ServLoginService } from '../../../../services/serv-login.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TablaReutilizableComponent } from '../../../shared/tabla-reutilizable/tabla-reutilizable.component';
import { MatInputModule } from '@angular/material/input';
import { forkJoin, map } from 'rxjs';

interface ResenaConPaciente extends Resena {
  nombrePaciente?: string;
}

@Component({
  selector: 'app-mantenimiento-ver-resena-profesional',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, FooterComponent, MatTableModule,
    MatPaginatorModule, TablaReutilizableComponent, MatInputModule
  ],
  templateUrl: './mantenimiento-ver-resena-profesional.component.html',
  styleUrl: './mantenimiento-ver-resena-profesional.component.css'
})
export class MantenimientoVerResenaProfesionalComponent {

  dataSource = new MatTableDataSource<ResenaConPaciente>();
  columnasKeys: string[] = [];

  columnas = [
    { key: 'nombrePaciente', titulo: 'Paciente' },
    { key: 'motivoVisita', titulo: 'Motivo de Visita' },
    { key: 'comentario', titulo: 'Comentario' },
    { key: 'calificacion', titulo: 'Calificación' },
    { key: 'recomienda', titulo: '¿Recomienda?' },
    { key: 'fechaResena', titulo: 'Fecha' }
  ];

  acciones: any[] = []; // No se muestran acciones para el profesional

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private servResena: ServResenasService,
    private servPaciente: ServPacientesService,
    private loginService: ServLoginService
  ) {}

  ngOnInit(): void {
    this.columnasKeys = this.columnas.map(c => c.key);
    this.cargarResenas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarResenas(): void {
    const profesionalId = String(this.loginService.getIdentificador());

    this.servResena.getResenasByProfesional(profesionalId).subscribe((resenas) => {
      const peticiones = resenas.map(resena => {
        const paciente$ = this.servPaciente.getPacientePorId(resena.pacienteId!);

        return paciente$.pipe(
          map(paciente => ({
            ...resena,
            nombrePaciente: paciente?.nombre || 'Desconocido'
          }))
        );
      });

      forkJoin(peticiones).subscribe((resenasConPaciente: ResenaConPaciente[]) => {
        this.dataSource.data = resenasConPaciente;
      });
    });
  }

  search(input: HTMLInputElement) {
    const termino = input.value.trim();
    const profesionalId = String(this.loginService.getIdentificador());

    if (termino) {
      this.servResena.getResenasByProfesional(profesionalId).subscribe((resenas) => {
        const filtradas = resenas.filter(r =>
          r.motivoVisita.toLowerCase().includes(termino.toLowerCase()) ||
          r.comentario?.toLowerCase().includes(termino.toLowerCase())
        );

        const peticiones = filtradas.map(resena => {
          const paciente$ = this.servPaciente.getPacientePorId(resena.pacienteId!);

          return paciente$.pipe(
            map(paciente => ({
              ...resena,
              nombrePaciente: paciente?.nombre || 'Desconocido'
            }))
          );
        });

        forkJoin(peticiones).subscribe((resenasConPaciente: ResenaConPaciente[]) => {
          this.dataSource.data = resenasConPaciente;
        });
      });
    } else {
      this.cargarResenas();
    }
  }
}
