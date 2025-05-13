import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DatePipe, NgIf } from '@angular/common';
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
import { Cuenta } from '../../../../models/Cuenta';

@Component({
  selector: 'app-registro-actualizacion-profesional',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatChipsModule, MatIcon, MatSelectModule, MatRadioModule, MatDatepickerModule, MatCardModule, DatePipe, ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './registro-actualizacion-profesional.component.html',
  styleUrl: './registro-actualizacion-profesional.component.css'
})
export class RegistroActualizacionProfesionalComponent {
  public form: FormGroup;
  public isEdit = false;
  public profesionalId: string | null = null;
  public profesionalOriginal: Profesional | null = null;
  public nuevaDisponibilidad: string = '';
  public especialidades: string[] = ['Pediatría', 'Cardiología', 'Dermatología', 'Ginecología', 'Neurología', 'Psicología', 'Odontología'];
  public fotoSeleccionada: File | null = null;
  public fotoPrevia: string | null = null;

  constructor( private fb: FormBuilder, private service: ServProfesionalesService, private servicioLogin: ServLoginService, private route: ActivatedRoute, private router: Router){
  this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/), Validators.min(5), Validators.max(50)]],
      especialidad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      ubicacion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/), Validators.min(3), Validators.max(50)]],
      edad: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      sexo: ['', Validators.required],
      disponibilidad: this.fb.control<string[]>([], [this.validarDisponibilidadMinima]),
      correo: ['', [Validators.required, Validators.email]], 
      clave: ['', [Validators.required, Validators.minLength(8)]],
      foto: [null, Validators.required]
    });
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
      disponibilidad: profesional.disponibilidad,
    });

    if (this.isEdit && profesional.foto) {
      this.fotoPrevia = profesional.foto; // Asegúrate de que `foto` sea una URL accesible
    }

    if (this.isEdit) {
      this.form.get('correo')?.disable();
      this.form.get('clave')?.disable();
    }
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.actualizar();
    } else {
      this.registrar();
    }
  }

  registrar(): void {
    this.service.getProfesionales().subscribe(profesionales => {
      const maxId = Math.max(...profesionales.map(p => +p.id || 0));
      const nuevoId = (maxId + 1).toString();

      const nuevoProfesional: Profesional = {
        id: nuevoId,
        nombre: this.form.value.nombre,
        especialidad: this.form.value.especialidad,
        ubicacion: this.form.value.ubicacion,
        edad: this.form.value.edad,
        sexo: this.form.value.sexo,
        telefono: this.form.value.telefono,
        disponibilidad: this.form.value.disponibilidad,
        foto: this.form.value.foto  
      };

      this.service.agregarProfesional(nuevoProfesional).subscribe(() => {
        const nuevaCuenta: Cuenta = {
          id: 'p' + nuevoId,
          email: this.form.value.correo,
          password: this.form.value.clave,
          rol: 'profesional',
          profesionalId: nuevoId
      };

      this.servicioLogin.registrarCuenta(nuevaCuenta).subscribe(() => {
          console.log(nuevoProfesional);
          alert("¡Profesional registrado con éxito!");
          this.router.navigate(['/login'], { replaceUrl: true });
        });
      });
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

  archivoSeleccionado(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fotoSeleccionada = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPrevia = reader.result as string;
        this.form.patchValue({ foto: this.fotoPrevia });
      };
      reader.readAsDataURL(file);
    }
  }

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

  validarDisponibilidadMinima(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && value.length > 0 ? null : { required: true };
  }

  eliminarDisponibilidad(index: number) {
    const lista = this.form.get('disponibilidad')?.value || [];
    lista.splice(index, 1);
    this.form.get('disponibilidad')?.setValue(lista);
  }

  isNoChanges(): boolean {
    // Verificar si no hubo cambios en el formulario
    return JSON.stringify(this.profesionalOriginal) === JSON.stringify(this.form.value);
  }

  onCancel(): void {
    if (this.isEdit) {
      this.router.navigate(['/profesional-dashboard']); // Redirigir a la pagina de inicio del profesional
    } else {
      this.router.navigate(['/registrar']); // Redirigir a la pagina para seleccionar el tipo de usuario
    }
  }
}
