import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ServLoginService } from '../services/serv-login.service';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private loginService: ServLoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userRol = decoded.rol;

      if (expectedRoles.includes(userRol)) {
        return true;
      } else {
        // Si no tiene el rol esperado, redirige
        this.router.navigate(['/acceso-denegado']); 
        return false;
      }
    } catch (e) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}