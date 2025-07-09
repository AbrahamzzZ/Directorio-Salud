import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServLoginService } from '../services/serv-login.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityGuard implements CanActivate {
  private inactividadTimer: any;
  private readonly tiempoInactividad = 10 * 1000; 
  private ultActividad: number = Date.now();

  constructor(
    private router: Router,
    private loginService: ServLoginService
  ) {
    this.initializeInactivityListeners();
  }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
  
    if (this.isTokenExpired(token)) {
      this.handleInactivity();
      return false;
    }
    
    this.resetinactividadTimer();
    return true;
  }

  private initializeInactivityListeners(): void {
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateultActividad();
      }, true);
    });
  }

  private updateultActividad(): void {
    this.ultActividad = Date.now();
    this.resetinactividadTimer();
  }

  private resetinactividadTimer(): void {
    if (this.inactividadTimer) {
      clearTimeout(this.inactividadTimer);
    }

    this.inactividadTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.tiempoInactividad);
  }

  private handleInactivity(): void {
   
    if (this.inactividadTimer) {
      clearTimeout(this.inactividadTimer);
    }
  
    this.loginService.cerrarSesion();
        
    this.router.navigate(['/login'], { 
      queryParams: { sessionExpired: 'true' } 
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  public clearinactividadTimer(): void {
    if (this.inactividadTimer) {
      clearTimeout(this.inactividadTimer);
    }
  }
}