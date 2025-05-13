import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ServicioMedico } from '../../../models/ServicioMedico';

import { ServServiciosjsonService } from '../../../services/servicio-servicios/serv-serviciosjson.service';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lista-servicios',
  imports: [HeaderComponent, FooterComponent, MatCardModule, MatButtonModule, UpperCasePipe, CurrencyPipe, DatePipe,
     MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './lista-servicios.component.html',
  styleUrl: './lista-servicios.component.css'
})
export class ListaServiciosComponent {
titulo:string="Servicios Disponibles"
servicios: ServicioMedico[] = [];

  constructor(private servicioService: ServServiciosjsonService,
  private router: Router) {}

  ngOnInit(): void {
    this.getServiciosAll();
    console.log(this.servicios[0]);
    
  }
  getServiciosAll(): void {
    this.servicioService.getAllServices().subscribe((data) => {
      this.servicios = data;
    });
  }
 agendarCita(servicio: ServicioMedico): void {
  this.router.navigate(['/registro-actualizacion-cita'], {
    state: { servicio }
  });
}

}
