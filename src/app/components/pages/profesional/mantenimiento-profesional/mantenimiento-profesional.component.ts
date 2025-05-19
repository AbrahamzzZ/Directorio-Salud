import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';
import { Profesional } from '../../../../models/Profesional';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TablaReutilizableComponent } from '../../../shared/tabla-reutilizable/tabla-reutilizable.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { DialogData } from '../../../../models/Dialog-data';

@Component({
  selector: 'app-mantenimiento-profesional',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatSnackBarModule, TablaReutilizableComponent],
  templateUrl: './mantenimiento-profesional.component.html',
  styleUrl: './mantenimiento-profesional.component.css'
})
export class MantenimientoProfesionalComponent {

  constructor(private servicio:ServProfesionalesService, private router:Router, private dialog: MatDialog){}
  dataSource = new MatTableDataSource<Profesional>();
  columnasKeys: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'especialidad', titulo: 'Especialidad' },
    { key: 'ubicacion', titulo: 'Ubicacion' },
    { key: 'disponibilidad', titulo: 'Disponibilidad' }, 
    { key: 'telefono', titulo: 'Telefono' } 
  ];

  displayedColumns: string[] = [...this.columnas.map(c => c.key), 'Accion'];

  accion = [
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar profesional' }
  ];

  gestionarAccion(event: { tipo: string, fila: Profesional }) {
    if (event.tipo === 'eliminar') {
      this.abrirDialogo(event.fila);
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.columnasKeys = this.columnas.map(c => c.key);
    this.displayedColumns = [...this.columnasKeys, 'Accion'];
    this.cargarProfesionales();
  }

  cargarProfesionales():void{
    this.servicio.getProfesionales().subscribe((datos:Profesional[])=>{
      this.dataSource.data = datos;
    })
  }

  buscar(searchInput: HTMLInputElement) {
    const termino = searchInput.value.trim();
    if (termino) {
      this.servicio.buscarProfesional(termino).subscribe((datos: Profesional[]) => {
        this.dataSource.data = datos;
      });
    } else {
      this.cargarProfesionales();
    }
  }

  abrirDialogo(profesional:Profesional) {
    this.dialogo(profesional);
  }

  dialogo(servicio:Profesional): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
          width: '400px',
          data: <DialogData>{
            title: 'Confirmar Eliminación',
            message: '¿Estás seguro de que deseas eliminar este profesional?',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            isConfirmation: true
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.eliminar(servicio); // Confirmado
        }
      });
  }

  eliminar(servicio:Profesional): void {
    this.servicio.eliminarProfesional(servicio).subscribe({
      next: () => {
        console.log(`Profesional con ID ${servicio.id} eliminado correctamente.`);
        this.cargarProfesionales();
        this.router.navigate(['/profesional-list'], { replaceUrl: true });
      },
      error: (error) => {
        console.error(`Error al eliminar profesional con ID ${servicio.id}:`, error);
      }
    });
  }
}
