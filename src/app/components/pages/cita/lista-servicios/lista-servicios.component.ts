import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UpperCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel, MatFormField, MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-lista-servicios',
  imports:[HeaderComponent, FooterComponent, MatCardModule, MatButtonModule, UpperCasePipe, CurrencyPipe, DatePipe,
     MatCardModule, MatButtonModule, MatIconModule, MatLabel, MatFormField, MatFormFieldModule, MatInputModule],
  templateUrl: './lista-servicios.component.html',
  styleUrls: ['./lista-servicios.component.css']
})
export class ListaServiciosComponent implements OnInit {
  listaDeServicios: ServicioMedico[] = [];
  listaDeServiciosOriginal: ServicioMedico[] = [];
  public termSearch: string = '';

  constructor(
    private servicioDeServicios: ServServiciosjsonService,
    private navegador: Router,
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicioDeServicios.getAllServices().subscribe(servicios => {
      this.listaDeServicios = servicios;
      this.listaDeServiciosOriginal = [...servicios];
    });
  }

  buscar(searchInput: HTMLInputElement) {
    const termino = searchInput.value.trim().toLowerCase();
    if (termino) {
      this.listaDeServicios = this.listaDeServiciosOriginal.filter(servicio =>
        servicio.nombre.toLowerCase().includes(termino) ||
        servicio.descripcion.toLowerCase().includes(termino)
      );
    } else {
      this.listaDeServicios = [...this.listaDeServiciosOriginal];
    }
  }

  agendarCita(servicio: ServicioMedico): void {
  this.navegador.navigate(['/registro-actualizacion-cita'], {
    queryParams: {
      id: servicio.id,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      fechaDisponible: servicio.fechaDisponible,
      precio: servicio.precio,
      profesionalId: servicio.profesionalId // ← AGREGAR ESTO
    }
  });
}
}