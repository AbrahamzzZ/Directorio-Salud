import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resena } from '../../../../models/Resena';
import { ServResenasService } from '../../../../services/servicio-resena/serv-resenas.service';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { TablaReutilizableComponent } from '../../../shared/tabla-reutilizable/tabla-reutilizable.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { DialogData } from '../../../../models/Dialog-data';
import { ServPacientesService } from '../../../../services/serv-pacientes.service';

interface ResenaConDetalles extends Resena {
  nombreProfesional?: string;
  nombrePaciente?: string;
}

@Component({
  selector: 'app-mantenimiento-resena-administrador',
  imports: [
    CommonModule, HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatInputModule, TablaReutilizableComponent, MatDialogModule
  ],
  templateUrl: './mantenimiento-resena-administrador.component.html',
  styleUrl: './mantenimiento-resena-administrador.component.css'
})
export class MantenimientoResenaAdministradorComponent {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<ResenaConDetalles>();
  columnasKeys: string[] = [];

  columnas = [
    { key: 'nombreProfesional', titulo: 'Profesional' },
    { key: 'nombrePaciente', titulo: 'Paciente' },
    { key: 'motivoVisita', titulo: 'Motivo de Visita' },
    { key: 'comentario', titulo: 'Comentario' },
    { key: 'calificacion', titulo: 'Calificación' },
    { key: 'recomienda', titulo: '¿Recomienda?' }
  ];

  acciones = [
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar reseña' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private servResena: ServResenasService,
    private servProfesional: ServProfesionalesService,
    private servPaciente: ServPacientesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.columnasKeys = this.columnas.map(c => c.key);
    this.displayedColumns = [...this.columnasKeys, 'acciones'];
    this.cargarResenas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarResenas(): void {
    this.servResena.getResenas().subscribe((resenas) => {
      const peticiones = resenas.map(resena => {
        const profesional$ = this.servProfesional.getProfesionalPorId(resena.profesionalId!);
        const paciente$ = this.servPaciente.getPacientePorId(resena.pacienteId!);

        return forkJoin([profesional$, paciente$]).pipe(
          map(([profesional, paciente]) => ({
            ...resena,
            nombreProfesional: profesional?.nombre || 'Desconocido',
            nombrePaciente: paciente?.nombre || 'Desconocido'
          }))
        );
      });

      forkJoin(peticiones).subscribe((resenasConDetalles: ResenaConDetalles[]) => {
        this.dataSource.data = resenasConDetalles;
      });
    });
  }

  search(input: HTMLInputElement) {
    const termino = input.value.trim();
    if (termino) {
      this.servResena.searchResenas(termino).subscribe((resenas) => {
        const peticiones = resenas.map(resena => {
          const profesional$ = this.servProfesional.getProfesionalPorId(resena.profesionalId!);
          const paciente$ = this.servPaciente.getPacientePorId(resena.pacienteId!);

          return forkJoin([profesional$, paciente$]).pipe(
            map(([profesional, paciente]) => ({
              ...resena,
              nombreProfesional: profesional?.nombre || 'Desconocido',
              nombrePaciente: paciente?.nombre || 'Desconocido'
            }))
          );
        });

        forkJoin(peticiones).subscribe((resenasConDetalles: ResenaConDetalles[]) => {
          this.dataSource.data = resenasConDetalles;
        });
      });
    } else {
      this.cargarResenas();
    }
  }

  gestionarAccion(event: { tipo: string, fila: ResenaConDetalles }) {
    if (event.tipo === 'eliminar') {
      this.eliminar(event.fila);
    }
  }

  eliminar(resena: ResenaConDetalles): void {
    this.confirmarEliminacion(resena);
  }

  confirmarEliminacion(resena: ResenaConDetalles): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar la reseña con motivo: "${resena.motivoVisita}"?`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado === true) {
        this.deleteResena(resena);
      }
    });
  }

  deleteResena(resena: Resena): void {
    this.servResena.deleteResena(resena).subscribe(() => {
      this.cargarResenas();
      this.router.navigate(['mantenimiento-resena-administrador'], { replaceUrl: true });
    });
  }
}
