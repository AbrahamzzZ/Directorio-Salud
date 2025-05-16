import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ServLoginService } from '../services/serv-login.service';

@Injectable({
  providedIn: 'root'
})

export class Autenticacion implements CanActivate {
  constructor(private login: ServLoginService, private router:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const auth = this.login.estaAutenticado();

    if (auth) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
