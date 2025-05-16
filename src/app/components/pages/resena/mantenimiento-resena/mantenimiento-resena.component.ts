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

interface ResenaConNombre extends Resena {
  nombreProfesional?: string;
}

@Component({
  selector: 'app-mantenimiento-resena',
  imports: [
    CommonModule, HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatInputModule, TablaReutilizableComponent, MatDialogModule],
  templateUrl: './mantenimiento-resena.component.html',
  styleUrl: './mantenimiento-resena.component.css'
})
export class MantenimientoResenaComponent {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<ResenaConNombre>();
  columnasKeys: string[] = [];

  columnas = [
    { key: 'nombreProfesional', titulo: 'Profesional' },
    { key: 'motivoVisita', titulo: 'Motivo de Visita' },
    { key: 'comentario', titulo: 'Comentario' },
    { key: 'calificacion', titulo: 'Calificación' },
    { key: 'recomienda', titulo: '¿Recomienda?' },
    { key: 'fechaResena', titulo: 'Fecha' }
  ];

  acciones = [
    { tipo: 'editar', icono: 'edit', tooltip: 'Editar reseña' },
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar reseña' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private servResena: ServResenasService,
    private servProfesional: ServProfesionalesService,
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
    this.servResena.getResenasByPaciente().subscribe((resenas) => {
      const peticiones = resenas.map(resena =>
        this.servProfesional.getProfesionalPorId(resena.profesionalId!).pipe(
          map((profesional) => ({
            ...resena,
            nombreProfesional: profesional?.nombre || 'Desconocido'
          }))
        )
      );

      forkJoin(peticiones).subscribe((resenasConNombre: ResenaConNombre[]) => {
        this.dataSource.data = resenasConNombre;
      });
    });
  }

  search(input: HTMLInputElement) {
    const termino = input.value.trim();
    if (termino) {
      this.servResena.searchResenasByPaciente(termino).subscribe((resenas) => {
        const peticiones = resenas.map(resena =>
          this.servProfesional.getProfesionalPorId(resena.profesionalId!).pipe(
            map((profesional) => ({
              ...resena,
              nombreProfesional: profesional?.nombre || 'Desconocido'
            }))
          )
        );

        forkJoin(peticiones).subscribe((resenasConNombre: ResenaConNombre[]) => {
          this.dataSource.data = resenasConNombre;
        });
      });
    } else {
      this.cargarResenas();
    }
  }

  gestionarAccion(event: { tipo: string, fila: ResenaConNombre }) {
    if (event.tipo === 'editar') {
      this.editar(event.fila);
    } else if (event.tipo === 'eliminar') {
      this.eliminar(event.fila);
    }
  }

  editar(resena: Resena) {
    this.router.navigate(['/resena-edit', resena.id]);
  }


  eliminar(resena: ResenaConNombre): void {
    this.confirmarEliminacion(resena);
  }

  confirmarEliminacion(resena: ResenaConNombre): void {
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
      this.router.navigate(['mantenimiento-resena'], { replaceUrl: true }); 
    });
  }

}