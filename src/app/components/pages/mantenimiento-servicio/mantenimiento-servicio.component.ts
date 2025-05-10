import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ServServiciosjsonService } from '../../../services/serv-serviciosjson.service';
import { ServicioMedico } from '../../../models/ServicioMedico';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from "@angular/common";
import { Route, Router } from "@angular/router";

@Component({
  selector: 'app-mantenimiento-servicio',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, DatePipe],
  templateUrl: './mantenimiento-servicio.component.html',
  styleUrl: './mantenimiento-servicio.component.css'
})
export class MantenimientoServicioComponent {

  constructor(private serviceServiciosMedicos:ServServiciosjsonService, private router:Router){}

  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'fechaDisponible', 'requiereChequeo', 'Acciones'];
  dataSource = new MatTableDataSource<ServicioMedico>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
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
