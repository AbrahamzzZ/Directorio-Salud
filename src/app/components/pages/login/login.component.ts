import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServLoginService } from '../../../services/serv-login.service';
import { ActivatedRoute, Router } from '@angular/router';
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
export class LoginComponent implements OnInit{
  public loginForm: FormGroup;
  public mensajeError: string = '';
  public mensajeInfo: string = '';
  public ocultarContrasena: boolean = true;

  constructor(private fb: FormBuilder, private loginService: ServLoginService, private router: Router, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {    
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.mensajeInfo = 'La sesion ha expirado. Por favor, inicie sesion nuevamente.';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.loginService.validarCredenciales(email, password).subscribe({
        next: (cuenta) => {
          if (cuenta) {
            this.mensajeError = '';
            this.mensajeInfo = '';
            
            if (cuenta.rol === 'profesional') {
              this.router.navigate(['/profesional-dashboard']);
            } else if (cuenta.rol === 'paciente') {
              this.router.navigate(['/patients-dashboard']);
            } else if (cuenta.rol === 'administrador') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.mensajeError = 'Rol desconocido';
            }
          } else {
            this.mensajeError = 'Usuario o contraseña incorrectos';
          }
        },
        error: (error) => {
          this.mensajeError = 'Error al iniciar sesion. Intente nuevamente.';
          console.error('Error de login:', error);
        }
      });
    }
  }

  registrar(){
    this.router.navigate(['/registrar']);
  }
}