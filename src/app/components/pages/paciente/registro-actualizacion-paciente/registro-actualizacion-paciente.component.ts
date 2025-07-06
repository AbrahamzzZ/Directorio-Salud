import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServPacientesService } from '../../../../services/servicio-paciente/serv-pacientes.service';
import { Paciente } from '../../../../models/Paciente';
import { MatIconModule } from '@angular/material/icon';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { Cuenta } from '../../../../models/Cuenta';
import { ServLoginService } from '../../../../services/serv-login.service';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registro-actualizacion-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  MatButtonModule, MatRadioModule, MatCheckboxModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './registro-actualizacion-paciente.component.html',
  styleUrl: './registro-actualizacion-paciente.component.css'
})
export class RegistroActualizacionPacienteComponent implements OnInit {
  pacienteForm: FormGroup;
  cuentaForm: FormGroup;
  isEditMode = false;
  pacienteId: string | null = null;
  pacienteOriginal: Paciente | null = null;
  cuentaOriginal: Cuenta | null = null;
  tiposDeSangre: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  metodosContacto: string[] = ['email', 'llamada telefónica', 'SMS'];
  isLoading = false;
  changePassword = false;
  changeEmail = false;

  constructor(
    private fb: FormBuilder,
    private pacientesService: ServPacientesService,
    private loginService: ServLoginService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      contacto: ['', Validators.required],
      tipoSangre: ['', Validators.required],
      estado: [true]
    });

    this.cuentaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }
  
  toggleChangeEmail(checked: boolean): void {
    this.changeEmail = checked;
    const emailControl = this.cuentaForm.get('email');

    if (checked) {
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl?.clearValidators();     
      if (this.cuentaOriginal) {
        emailControl?.setValue(this.cuentaOriginal.email);
      }
    }
    emailControl?.updateValueAndValidity();
  }
  
  toggleChangePassword(checked: boolean): void {
    this.changePassword = checked;
    const passwordControl = this.cuentaForm.get('password');
    const confirmPasswordControl = this.cuentaForm.get('confirmPassword');

    if (checked) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
      passwordControl?.setValue('');
      confirmPasswordControl?.setValue('');
    }
    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.pacienteId = this.route.snapshot.paramMap.get('id');
    if (this.pacienteId) {
      this.isEditMode = true;
      this.setupEditModeValidation();
      this.loadPacienteData();
    }
  }

  private setupEditModeValidation(): void {   
    const emailControl = this.cuentaForm.get('email');
    const passwordControl = this.cuentaForm.get('password');
    const confirmPasswordControl = this.cuentaForm.get('confirmPassword');

    emailControl?.clearValidators();
    passwordControl?.clearValidators();
    confirmPasswordControl?.clearValidators();

    emailControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  private loadPacienteData(): void {
    this.pacientesService.getPacientePorId(this.pacienteId!).subscribe({
      next: (paciente) => {
        this.pacienteOriginal = paciente;
        this.populateForm(paciente);
        this.loadCuentaData();
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.showErrorDialog('El paciente no se encuentra registrado.');
        this.router.navigate(['/admin-dashboard']);
      }
    });
  }

  private loadCuentaData(): void {
    this.loginService.obtenerCuentaPorPacienteId(this.pacienteId!).subscribe({
      next: (cuenta) => {
        if (cuenta) {
          this.cuentaOriginal = cuenta;
          this.populateCuentaForm(cuenta);
        }
      },
      error: (error) => {
        console.error('Error loading account:', error);
        this.showErrorDialog('No se encontró una cuenta asociada al paciente.');
      }
    });
  }

  populateForm(paciente: Paciente): void {
    this.pacienteForm.patchValue({
      nombre: paciente.nombre,
      telefono: paciente.telefono,
      edad: paciente.edad,
      contacto: paciente.contacto,
      tipoSangre: paciente.tipoSangre,
      estado: paciente.estado
    });
  }

  populateCuentaForm(cuenta: Cuenta): void {
    this.cuentaForm.patchValue({
      email: cuenta.email,
      password: '', 
      confirmPassword: ''
    });
  }

  onSubmit(): void {    
    if (!this.pacienteForm.valid || !this.cuentaForm.valid) {
      this.markFormGroupTouched(this.pacienteForm);
      this.markFormGroupTouched(this.cuentaForm);
      this.showErrorDialog('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    this.isLoading = true;
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        title: 'Confirmación',
        message: this.isEditMode ? '¿Está seguro de actualizar los datos de este paciente?' : '¿Está seguro de registrarse?',
        isConfirmation: true
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (this.isEditMode) {
          this.updatePaciente();
        } else {
          this.addPaciente();
        }
      } else {
        this.isLoading = false;
      }
    });
  }

  addPaciente(): void {
    const newPaciente: Paciente = {
      ...this.pacienteForm.value,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    const newCuenta: Cuenta = {
      email: this.cuentaForm.value.email,
      password: this.cuentaForm.value.password,
      rol: 'paciente'
    };

    this.pacientesService.addPatient(newPaciente, newCuenta).subscribe({
      next: (paciente) => {
        this.isLoading = false;
        this.showSuccessDialog('Paciente registrado exitosamente', () => {
          this.router.navigate(['/login'], { replaceUrl: true });
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error registering patient:', error);        
        
        let errorMessage = 'Error desconocido al registrar paciente';
        if (error.error?.mensaje) {
          errorMessage = error.error.mensaje;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.showErrorDialog(errorMessage);
      }
    });
  }

  updatePaciente(): void {
    const updatedPaciente: Paciente = {
      ...this.pacienteOriginal!,
      ...this.pacienteForm.value,
      id: this.pacienteOriginal!.id
    };

    if (this.cuentaOriginal && (this.changePassword || this.changeEmail)) {
      const updatedCuenta: Cuenta = {
        ...this.cuentaOriginal,
        email: this.changeEmail ? this.cuentaForm.value.email : this.cuentaOriginal.email,
        password: this.changePassword ? this.cuentaForm.value.password : this.cuentaOriginal.password
      };

      forkJoin({
        paciente: this.pacientesService.editPatient(updatedPaciente),
        cuenta: this.loginService.registrarCuenta(updatedCuenta)
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessDialog('Paciente actualizado exitosamente', () => {
            this.router.navigate(['/mis-pacientes'], { replaceUrl: true });
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating patient:', error);
          this.showErrorDialog(`Error al actualizar: ${error.message}`);
        }
      });
    } else {      
      this.pacientesService.editPatient(updatedPaciente).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessDialog('Paciente actualizado exitosamente', () => {
            this.router.navigate(['/mis-pacientes'], { replaceUrl: true });
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating patient:', error);
          this.showErrorDialog(`Error al actualizar paciente: ${error.message}`);
        }
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/mis-pacientes']);
    } else {
      this.router.navigate(['/registrar']);
    }
  }

  // Métodos auxiliares para mostrar diálogos
  private showSuccessDialog(message: string, callback?: () => void): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        title: 'Éxito',
        message: message,
        isConfirmation: false
      },
      disableClose: true
    });

    if (callback) {
      dialogRef.afterClosed().subscribe(() => callback());
    }
  }

  private showErrorDialog(message: string): void {
    this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        title: 'Error',
        message: message,
        isConfirmation: false
      },
      disableClose: true
    });
  }

  // Método para marcar todos los campos como tocados
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}