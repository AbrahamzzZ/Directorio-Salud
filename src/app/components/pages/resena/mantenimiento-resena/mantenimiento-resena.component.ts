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

  // Columnas de la tabla, incluyendo la clave para acceder a los datos y el título que se mostrará.
  columnas = [
    { key: 'nombreProfesional', titulo: 'Profesional' },
    { key: 'motivoVisita', titulo: 'Motivo de Visita' },
    { key: 'comentario', titulo: 'Comentario' },
    { key: 'calificacion', titulo: 'Calificación' },
    { key: 'recomienda', titulo: '¿Recomienda?' },
    { key: 'fechaResena', titulo: 'Fecha' }
  ];

  // Acciones que se podrán realizar en cada fila de la tabla (editar y eliminar).
  acciones = [
    { tipo: 'editar', icono: 'edit', tooltip: 'Editar reseña' },
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar reseña' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;   // ViewChild para obtener una referencia al componente MatPaginator.

  constructor(
    private servResena: ServResenasService,
    private servProfesional: ServProfesionalesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  // Método que se ejecuta al inicializar el componente.
  ngOnInit(): void {
    this.columnasKeys = this.columnas.map(c => c.key);
    this.displayedColumns = [...this.columnasKeys, 'acciones'];
    this.cargarResenas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Método para cargar las reseñas del paciente actual y el nombre del profesional asociado.
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

      // ForkJoin para esperar a que todas las peticiones a los profesionales se completen.
      forkJoin(peticiones).subscribe((resenasConNombre: ResenaConNombre[]) => {
        // Asigna los datos combinados (reseñas con nombres de profesionales) al dataSource de la tabla.
        this.dataSource.data = resenasConNombre;
      });
    });
  }

  // Método para realizar la búsqueda de reseñas por un término ingresado por el usuario.
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

        // Espera a que todas las peticiones de nombres de profesionales se completen.
        forkJoin(peticiones).subscribe((resenasConNombre: ResenaConNombre[]) => {
          this.dataSource.data = resenasConNombre;
        });
      });
    } else {
      this.cargarResenas();
    }
  }

  // Método para gestionar la acción editar o eliminar.
  gestionarAccion(event: { tipo: string, fila: ResenaConNombre }) {
    if (event.tipo === 'editar') {
      this.editar(event.fila);
    } else if (event.tipo === 'eliminar') {
      this.eliminar(event.fila);
    }
  }

  // Método para navegar a la página de edición de una reseña específica.
  editar(resena: Resena) {
    this.router.navigate(['/resena-edit', resena.id]);
  }

  // Método para iniciar el proceso de eliminación de una reseña.
  eliminar(resena: ResenaConNombre): void {
    this.confirmarEliminacion(resena);
  }

  // Método para mostrar un diálogo de confirmación al usuario antes de eliminar una reseña.
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

  // Método para eliminar una reseña específica.
  deleteResena(resena: Resena): void {
    this.servResena.deleteResena(resena).subscribe(() => {
      this.cargarResenas();
      this.router.navigate(['mantenimiento-resena'], { replaceUrl: true });
    });
  }

}