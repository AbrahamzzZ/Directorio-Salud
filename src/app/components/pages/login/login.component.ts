import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServLoginService } from '../../../services/serv-login.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule, MatFormField, MatIcon, MatCardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loginForm: FormGroup;
  public mensajeError: string = '';
  public ocultarContrasena: boolean = true;

  constructor(private fb: FormBuilder, private loginService: ServLoginService, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loginService.validarCredenciales(email, password).subscribe(cuenta => {
        if (cuenta) {
          this.mensajeError = '';
          if (cuenta.rol === 'profesional') {
            this.router.navigate(['/profesional-dashboard']);
          } else if (cuenta.rol === 'usuario') {
            this.router.navigate(['/patients-dashboard']);
          } else if(cuenta.rol === 'administrador'){
            this.router.navigate(['/admin-dashboard'])
          }else {
            this.mensajeError = 'Rol desconocido';
          }
        } else {
          this.mensajeError = 'Usuario o contraseña incorrectos';
        }
      });
    }
  }

  registrar(){
    this.router.navigate(['/registrar']);
  }
}