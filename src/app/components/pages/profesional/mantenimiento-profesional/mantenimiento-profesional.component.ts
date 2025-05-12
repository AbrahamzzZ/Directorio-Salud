import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ServProfesionalesService } from '../../../../services/serv-profesionales.service';
import { Profesional } from '../../../../models/Profesional';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-mantenimiento-profesional',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatIcon, DatePipe],
  templateUrl: './mantenimiento-profesional.component.html',
  styleUrl: './mantenimiento-profesional.component.css'
})
export class MantenimientoProfesionalComponent {

  constructor(private servicio:ServProfesionalesService, private router:Router){}
  displayedColumns: string[] = ['nombre', 'especialidad', 'ubicacion', 'disponibilidad', 'sexo', 'telefono', 'accion'];
  dataSource = new MatTableDataSource<Profesional>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
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

  eliminar(servicio:Profesional) {
    const confirmado = confirm("Estas seguro de eliminar este profesional: "+servicio.nombre+" ?");
    if(confirmado){
      this.servicio.eliminarProfesional(servicio).subscribe(()=>{
        alert("Profesional eliminado exitosamente");
        this.cargarProfesionales();
      })
    }
  }
}
