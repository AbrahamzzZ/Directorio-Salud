import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-acceso-denegado',
  imports: [MatIconModule],
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.css'
})
export class AccesoDenegadoComponent {
  constructor(private location: Location) {}

  volverAtras() {
    this.location.back();
  }
}
