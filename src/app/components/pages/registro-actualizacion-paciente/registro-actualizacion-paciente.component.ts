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
import { ServPacientesService } from '../../../services/serv-pacientes.service';
import { Paciente } from '../../../models/Paciente';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-registro-actualizacion-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  MatButtonModule, MatRadioModule, MatCheckboxModule, MatCardModule, HeaderComponent, FooterComponent],
  templateUrl: './registro-actualizacion-paciente.component.html',
  styleUrl: './registro-actualizacion-paciente.component.css'
})
export class RegistroActualizacionPacienteComponent implements OnInit {
  pacienteForm: FormGroup;
  isEdit = false;
  pacienteId: string | null = null;
  pacienteOriginal: Paciente | null = null;
  tiposDeSangre: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  metodosContacto: string[] = ['email', 'llamada telefónica', 'SMS'];

  constructor(
    private fb: FormBuilder,
    private pacientesService: ServPacientesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Edad: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      diagnostico: [''],
      contacto: ['', Validators.required],
      tipoSangre: [''],
      fechaRegistro: [new Date().toISOString().split('T')[0], Validators.required],
      estado: [true]
    });
  }

  ngOnInit(): void {    
    this.pacienteId = this.route.snapshot.paramMap.get('id');
    if (this.pacienteId) {
      this.isEdit = true;
      this.pacientesService.getpacientes().subscribe(pacientes => {
        const paciente = pacientes.find(p => p.id === this.pacienteId);
        if (paciente) {
          this.pacienteOriginal = paciente;
          this.populateForm(paciente);
        } else {        
          alert('El paciente no se encuentra registrado');
          this.router.navigate(['/admin-dashboard']);
        }
      });
    }
  }

  populateForm(paciente: Paciente): void {
    this.pacienteForm.patchValue({
      nombre: paciente.nombre,
      correo: paciente.correo,
      telefono: paciente.telefono,
      Edad: paciente.Edad,
      diagnostico: paciente.diagnostico,
      contacto: paciente.contacto,
      tipoSangre: paciente.tipoSangre,
      fechaRegistro: paciente.fechaRegistro,
      estado: paciente.estado
    });
  }

  onSubmit(): void {  
    if (this.isEdit) {
      this.updatePaciente();
    } else {
      this.addPaciente();
    }
  }

  addPaciente(): void {    
    const nuevo = 'p' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    const newPaciente: Paciente = {
      id: nuevo,
      ...this.pacienteForm.value
    };

    this.pacientesService.addPatient(newPaciente).subscribe(() => {
      alert("Paciente registrado exitosamente");
      this.router.navigate(['/mis-pacientes'], { replaceUrl: true });
    });
  }

  updatePaciente(): void {
    const updatedPaciente: Paciente = {
      ...this.pacienteOriginal!,
      ...this.pacienteForm.value
    };    
    this.pacientesService.editPatient(updatedPaciente).subscribe(() => {
      alert("El paciente se ha actualizado correctamente");
      this.router.navigate(['/mis-pacientes'], { replaceUrl: true });
    });
  } 

  onCancel(): void {
    this.router.navigate(['/mis-pacientes']);
  }
}