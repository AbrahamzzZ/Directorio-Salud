import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Paciente } from '../../../../models/Paciente';
import { ServPacientesService } from '../../../../services/servicio-paciente/serv-pacientes.service';
import { Router } from '@angular/router';
import { TablaReutilizableComponent } from '../../../shared/tabla-reutilizable/tabla-reutilizable.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mantenimiento-paciente',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, TablaReutilizableComponent, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './mantenimiento-paciente.component.html',
  styleUrl: './mantenimiento-paciente.component.css'
})
export class MantenimientoPacienteComponent implements OnInit, AfterViewInit {
  constructor(
    private servicePacientes: ServPacientesService, 
    private router: Router,
    private dialog: MatDialog
  ) {}

  dataSource = new MatTableDataSource<Paciente>();
  col: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = [
    { key: 'nombre', titulo: 'Nombre' },  
    { key: 'telefono', titulo: 'Telefono' },
    { key: 'Edad', titulo: 'Edad' },    
    { key: 'tipoSangre', titulo: 'Tipo de Sangre' },
    { key: 'fechaRegistro', titulo: 'Fecha de Registro' }, 
    { key: 'estado', titulo: 'Estado'}       
  ];

  displayedColumns: string[] = [...this.columns.map(cm => cm.key), 'Acciones'];

  acciones = [
    { tipo: 'editar', icono: 'edit', tooltip: 'Editar paciente' },
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar paciente' }
  ];

  ngOnInit(): void {
    this.col = this.columns.map(cm => cm.key);
    this.displayedColumns = [...this.col, 'Acciones'];
    this.cargarPacientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarPacientes(): void {
    this.servicePacientes.getpacientes().subscribe((datos: Paciente[]) => {
      this.dataSource.data = datos;
    });
  }

  search(searchInput: HTMLInputElement) {
    const texto = searchInput.value.trim();
    if (texto) {
      this.servicePacientes.getpacientesSearch(texto).subscribe((datos: Paciente[]) => {
        this.dataSource.data = datos;
      });
    } else {
      this.cargarPacientes();
    }
  }

  manejarAccion(evento: { tipo: string, fila: Paciente }) {
    switch (evento.tipo) {
      case 'editar':
        this.editar(evento.fila);
        break;
      case 'eliminar':
        this.eliminar(evento.fila);
        break;
    }
  }

  editar(paciente: Paciente) {
    this.router.navigate(['editar-pacientes', paciente.id]);
  }

  eliminar(paciente: Paciente) {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar al paciente ${paciente.nombre}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicePacientes.deletePatient(paciente).subscribe(() => {
          const alertDialog = this.dialog.open(DialogoComponent, {
            width: '400px',
            data: {
              title: 'Éxito',
              message: 'Paciente eliminado exitosamente',
              isConfirmation: false
            }
          });
          
          alertDialog.afterClosed().subscribe(() => {
            this.cargarPacientes();
          });
        });
      }
    });
  }
}
