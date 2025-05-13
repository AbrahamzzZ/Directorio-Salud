import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { ServicioMedico } from '../../../../models/ServicioMedico';

import {Component, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { TablaReutilizableComponent } from "../../../shared/tabla-reutilizable/tabla-reutilizable.component";
import { ServServiciosjsonService } from "../../../../services/servicio-servicios/serv-serviciosjson.service";

@Component({
  selector: 'app-mantenimiento-servicio',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, DatePipe, TablaReutilizableComponent],
  templateUrl: './mantenimiento-servicio.component.html',
  styleUrl: './mantenimiento-servicio.component.css'
})
export class MantenimientoServicioComponent {

  constructor(private serviceServiciosMedicos:ServServiciosjsonService, private router:Router){}

  // displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'fechaDisponible', 'requiereChequeo', 'Acciones'];
  dataSource = new MatTableDataSource<ServicioMedico>();
  columnasKeys: string[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'descripcion', titulo: 'Descripción' },
    { key: 'precio', titulo: 'Precio' },
    { key: 'fechaDisponible', titulo: 'Fecha Disponible' }, 
    { key: 'requiereChequeo', titulo: 'Requiere Chequeo' }    
  ];

  displayedColumns: string[] = [...this.columnas.map(c => c.key), 'Acciones'];

  acciones = [
    { tipo: 'editar', icono: 'edit', tooltip: 'Editar servicios' },
    { tipo: 'eliminar', icono: 'delete', tooltip: 'Eliminar servicio' }
  ];

  gestionarAccion(event: { tipo: string, fila: ServicioMedico }) {
    if (event.tipo === 'editar') {
      this.editar(event.fila);
    } else if (event.tipo === 'eliminar') {
      this.eliminar(event.fila);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.columnasKeys = this.columnas.map(c => c.key);
    this.displayedColumns = [...this.columnasKeys, 'Acciones'];
    this.cargarServicios();
  }

  cargarServicios():void{
    this.serviceServiciosMedicos.getServices().subscribe((datos:ServicioMedico[])=>{
      this.dataSource.data = datos;
    })
  }

  search(searchInput: HTMLInputElement) {
    const termino = searchInput.value.trim();
    if (termino) {
      this.serviceServiciosMedicos.getServicesSearch(termino).subscribe((datos: ServicioMedico[]) => {
        this.dataSource.data = datos;
      });
    } else {
      this.cargarServicios(); // recarga todos los datos si no hay texto
    }
  }

  editar(servicio: ServicioMedico) {
    this.router.navigate(['/service-edit', servicio.id]);
  }

  eliminar(servicio:ServicioMedico) {
    const confirmado = confirm("Estas seguro de eliminar el servicio de nombre: "+servicio.nombre+" ?");
    if(confirmado){
      this.serviceServiciosMedicos.deleteService(servicio).subscribe(()=>{
        alert("Servicio eliminado exitosamente");
        this.cargarServicios(); //actualizar el datasource
      })
    }
  }
}
