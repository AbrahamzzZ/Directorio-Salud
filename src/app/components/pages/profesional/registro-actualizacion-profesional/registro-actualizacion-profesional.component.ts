import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Profesional } from '../../../../models/Profesional';
import { ActivatedRoute, Router } from '@angular/router';
import { ServProfesionalesService } from '../../../../services/serv-profesionales.service';
import { ServLoginService } from '../../../../services/serv-login.service';
import { MatChipsModule} from '@angular/material/chips';
import { MatIcon} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-registro-actualizacion-profesional',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatChipsModule, MatIcon, MatSelectModule, MatRadioModule, MatDatepickerModule, MatCardModule, DatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './registro-actualizacion-profesional.component.html',
  styleUrl: './registro-actualizacion-profesional.component.css'
})
export class RegistroActualizacionProfesionalComponent {
  public form: FormGroup;
  public isEdit = false;
  profesionalId: string | null = null;
  profesionalOriginal: Profesional | null = null;
  public especialidades: string[] = [
    'Pediatría',
    'Cardiología',
    'Dermatología',
    'Ginecología',
    'Neurología',
    'Psicología',
    'Odontología'
  ];

  constructor( private fb: FormBuilder, private service: ServProfesionalesService, private servicioLogin: ServLoginService, private route: ActivatedRoute, private router: Router){
  this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/), Validators.min(5), Validators.max(50)]],
      especialidad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      ubicacion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/), Validators.min(3), Validators.max(50)]],
      edad: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      sexo: ['', Validators.required],
      disponibilidad: this.fb.control<string[]>([], [this.validarDisponibilidadMinima])
    });
  }

  validarDisponibilidadMinima(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && value.length > 0 ? null : { required: true };
  }

  public nuevaDisponibilidad: string = '';

  agregarDisponibilidad() {
    if (this.nuevaDisponibilidad) {
      const lista = this.form.get('disponibilidad')?.value || [];
      if (!lista.includes(this.nuevaDisponibilidad)) {
        lista.push(this.nuevaDisponibilidad);
        this.form.get('disponibilidad')?.setValue(lista);
      }
      this.nuevaDisponibilidad = '';
    }
  }

  eliminarDisponibilidad(index: number) {
    const lista = this.form.get('disponibilidad')?.value || [];
    lista.splice(index, 1);
    this.form.get('disponibilidad')?.setValue(lista);
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    this.profesionalId = this.route.snapshot.paramMap.get('id');
    if (this.profesionalId) {
      this.isEdit = true;
      this.service.obtenerprofesionalID(this.profesionalId).subscribe(profesional => {
        this.profesionalOriginal = profesional; 
        this.populateForm(profesional);
      });
    }
  }

  populateForm(profesional: Profesional): void {
    this.form.patchValue({
      nombre: profesional.nombre,
      especialidad: profesional.especialidad,
      ubicacion: profesional.ubicacion,
      edad: profesional.edad,
      telefono: profesional.telefono,
      sexo: profesional.sexo,
      disponibilidad: profesional.disponibilidad
    });
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.actualizar();
    } else {
      this.registrar();
    }
  }

  registrar(): void {
    const profesionalId = this.servicioLogin.getIdentificador();
    const newServicio: Profesional = {
      ...this.form.value,
      profesionalId: profesionalId ?? '', // agrega el ID del profesional
  };

    this.service.agregarProfesional(newServicio).subscribe(() => {
      alert("Servicio almacenado con exito!");
      this.router.navigate(['/profesional-dashboard'], { replaceUrl: true }); // Redirige a la lista
    });
  }

  actualizar(): void {
    const updatedServicio: Profesional = {
      ...this.profesionalOriginal!,
      ...this.form.value
    };
    this.service.editarInformacionProfesional(updatedServicio).subscribe(() => {
      alert("Personal editado exisotasamente!");
    
      this.router.navigate(['/profesional-dashboard'], { replaceUrl: true });

    });
  }

  isNoChanges(): boolean {
    // Verificar si no hubo cambios en el formulario
    return JSON.stringify(this.profesionalOriginal) === JSON.stringify(this.form.value);
  }

  onCancel(): void {
    this.router.navigate(['/registrar']); // Redirigir al listado de servicios
  }
}
