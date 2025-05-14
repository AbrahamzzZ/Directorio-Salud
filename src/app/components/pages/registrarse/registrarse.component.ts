import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-registrarse',
  imports: [MatSelectModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {
  constructor(private router: Router) {}

  redirigir(tipo: string) {
    if (tipo === 'profesional') {
      this.router.navigate(['/profesional-register']);
    } else if (tipo === 'paciente') {
      this.router.navigate(['/pacientes-registro']);
    }
  }
}
