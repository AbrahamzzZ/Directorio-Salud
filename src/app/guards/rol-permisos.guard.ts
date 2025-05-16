import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment} from '@angular/router';
import { ServLoginService } from '../services/serv-login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RolPermisos implements CanMatch{
  constructor(private autenticacion: ServLoginService, private router: Router){}

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const url = '/' + segments.map(s => s.path).join('/');
    const rol = this.autenticacion.getRol();

    // Define permisos por rol
    const permisos: { [key: string]: string[] } = {
      profesional: ['/profesional-dashboard', '/profesional-list', '/profesional-register', '/profesional-edit'],
      paciente: ['/patients-dashboard', '/pacientes-registro', '/editar-pacientes', '/mis-pacientes'],
      administrador: ['/admin-dashboard']
    };

    const rutasPermitidas = permisos[rol] || [];

    if (rutasPermitidas.some(p => url.startsWith(p))) {
      return true;
    } else {
      // Redirigir según el rol
      if (rol === 'profesional') {
        this.router.navigate(['/profesional-dashboard']);
      } else if (rol === 'paciente') {
        this.router.navigate(['/patients-dashboard']);
      } else if (rol === 'administrador') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
} 
