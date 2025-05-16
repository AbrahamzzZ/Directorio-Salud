import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { MatIconModule } from '@angular/material/icon';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { Cuenta } from '../../../../models/Cuenta';
import { ServLoginService } from '../../../../services/serv-login.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registro-actualizacion-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  MatButtonModule, MatRadioModule, MatCheckboxModule, MatCardModule, MatIconModule],
  templateUrl: './registro-actualizacion-paciente.component.html',
  styleUrl: './registro-actualizacion-paciente.component.css'
})
export class RegistroActualizacionPacienteComponent implements OnInit {
  fechaMin: Date = new Date();
  pacienteForm: FormGroup;
  cuentaForm: FormGroup;
  isEditMode = false;
  pacienteId: string | null = null;
  pacienteOriginal: Paciente | null = null;
  cuentaOriginal: Cuenta | null = null;
  tiposDeSangre: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  metodosContacto: string[] = ['email', 'llamada telefónica', 'SMS'];  
  
  private jsonUrlCuentas = 'http://localhost:3000/cuentas';

  constructor(
    private fb: FormBuilder,
    private pacientesService: ServPacientesService,
    private loginService: ServLoginService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Edad: ['', [Validators.required, Validators.min(0), Validators.max(120)]],      
      contacto: ['', Validators.required],
      tipoSangre: ['', Validators.required],
      fechaRegistro: ['', Validators.required],
      estado: [true]
    });

    this.cuentaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {    
    this.pacienteId = this.route.snapshot.paramMap.get('id');
    if (this.pacienteId) {
      this.isEditMode = true;
      this.pacientesService.getpacientes().subscribe(pacientes => {
        const paciente = pacientes.find(p => p.id === this.pacienteId);
        if (paciente) {
          this.pacienteOriginal = paciente;
          this.populateForm(paciente);          
          this.http.get<Cuenta[]>(this.jsonUrlCuentas).subscribe(cuentas => {
            const cuenta = cuentas.find(c => c.pacienteId === this.pacienteId);
            if (cuenta) {
              this.cuentaOriginal = cuenta;
              this.populateCuentaForm(cuenta);
            }
          });
        } else {
          const dialogRef = this.dialog.open(DialogoComponent, {
            width: '400px',
            data: {
              title: 'Error',
              message: 'El paciente no se encuentra registrado',
              isConfirmation: false
            },
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/admin-dashboard']);
          });
        }
      });
    }
  }

  populateForm(paciente: Paciente): void {
    this.pacienteForm.patchValue({
      nombre: paciente.nombre,      
      telefono: paciente.telefono,
      Edad: paciente.Edad,
      contacto: paciente.contacto,
      tipoSangre: paciente.tipoSangre,
      fechaRegistro: paciente.fechaRegistro,
      estado: paciente.estado
    });
  }

  populateCuentaForm(cuenta: Cuenta): void {
    this.cuentaForm.patchValue({
      email: cuenta.email,
      password: cuenta.password
    });
  }

  onSubmit(): void {    
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        title: 'Confirmación',
        message: this.isEditMode ? 
          '¿Está seguro de actualizar los datos de este paciente?' : 
          '¿Está seguro de registrarse?',
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
      }    
    });
  }

  addPaciente(): void {
    this.pacientesService.getpacientes().subscribe({
      next: (pacientes) => {
        let nextIdNumber = 1;
        if (pacientes && pacientes.length > 0) {
          const idNumbers = pacientes
            .map(p => {
              if (p.id && typeof p.id === 'string') {
                const num = parseInt(p.id, 10);
                return isNaN(num) ? null : num;
              }
              return null;
            })
            .filter((num): num is number => num !== null);
          
          if (idNumbers.length > 0) {
            nextIdNumber = Math.max(...idNumbers) + 1;
          }
        }
        
        const newPaciente: Paciente = {
          id: nextIdNumber.toString(),
          ...this.pacienteForm.value
        };
        
        const newCuenta: Cuenta = {
          id: nextIdNumber.toString(), 
          email: this.cuentaForm.value.email,
          password: this.cuentaForm.value.password,
          rol: 'paciente',
          pacienteId: nextIdNumber.toString()
        };
        
        this.pacientesService.addPatient(newPaciente).subscribe({
          next: () => {
            this.loginService.registrarCuenta(newCuenta).subscribe({
              next: () => {
                this.router.navigate(['/login'], { replaceUrl: true });
              },
              error: (error) => {
                this.dialog.open(DialogoComponent, {
                  width: '400px',
                  data: {
                    title: 'Error',
                    message: `Error al crear la cuenta: ${error.message}`,
                    isConfirmation: false
                  },
                  disableClose: true
                });
              }
            });
          },
          error: (error) => {
            this.dialog.open(DialogoComponent, {
              width: '400px',
              data: {
                title: 'Error',
                message: `Error al registrar paciente: ${error.message}`,
                isConfirmation: false
              },
              disableClose: true
            });
          }
        });
      },
      error: (error) => {
        this.dialog.open(DialogoComponent, {
          width: '400px',
          data: {
            title: 'Error',
            message: `Error al obtener pacientes: ${error.message}`,
            isConfirmation: false
          },
          disableClose: true
        });
      }
    });
  }

  updatePaciente(): void {
    const updatedPaciente: Paciente = {
      ...this.pacienteOriginal!,
      ...this.pacienteForm.value
    };    
    if (this.cuentaOriginal) {
      const updatedCuenta: Cuenta = {
        ...this.cuentaOriginal,
        email: this.cuentaForm.value.email,
        password: this.cuentaForm.value.password
      };
      forkJoin({
        paciente: this.pacientesService.editPatient(updatedPaciente),
        cuenta: this.http.put<Cuenta>(`${this.jsonUrlCuentas}/${updatedCuenta.id}`, updatedCuenta)
      }).subscribe({
        next: () => {       
          this.router.navigate(['/mis-pacientes'], { replaceUrl: true });
        },
        error: (error) => {
          this.dialog.open(DialogoComponent, {
            width: '400px',
            data: {
              title: 'Error',
              message: `Error al actualizar: ${error.message}`,
              isConfirmation: false
            },
            disableClose: true
          });
        }
      });
    } else {     
      this.pacientesService.editPatient(updatedPaciente).subscribe({
        next: () => {          
          this.router.navigate(['/mis-pacientes'], { replaceUrl: true });
        },
        error: (error) => {
          this.dialog.open(DialogoComponent, {
            width: '400px',
            data: {
              title: 'Error',
              message: `Error al actualizar paciente: ${error.message}`,
              isConfirmation: false
            },
            disableClose: true
          });
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
}