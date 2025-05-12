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
import { DatePipe} from '@angular/common';
import { ServLoginService } from '../../../../services/serv-login.service';

@Component({
  selector: 'app-mantenimiento-profesional',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, DatePipe],
  templateUrl: './mantenimiento-profesional.component.html',
  styleUrl: './mantenimiento-profesional.component.css'
})
export class MantenimientoProfesionalComponent {

  constructor(private servicio:ServProfesionalesService, private servicioLogin: ServLoginService, private router:Router){}
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

  eliminar(profesional:Profesional) {
    const confirmado = confirm("Estas seguro de eliminar este profesional: "+profesional.nombre+" ?");
    if(confirmado){
      // Paso 1: Eliminar al profesional
      this.servicio.eliminarProfesional(profesional).subscribe(() => {
        // Paso 2: Buscar la cuenta asociada y eliminarla
        this.servicioLogin.obtenerCuentaPorProfesionalId(profesional.id).subscribe(cuenta => {
          if (cuenta) {
            this.servicioLogin.eliminarCuenta(cuenta.id).subscribe(() => {
              alert("Profesional y su cuenta eliminados exitosamente");
              this.cargarProfesionales();
            });
          } else {
            alert("Profesional eliminado (no se encontró cuenta asociada)");
            this.cargarProfesionales();
          }
        });
      });
    }
  }
}
