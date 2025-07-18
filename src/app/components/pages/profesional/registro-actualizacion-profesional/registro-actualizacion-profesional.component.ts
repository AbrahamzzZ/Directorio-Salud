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
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';
import { ServLoginService } from '../../../../services/serv-login.service';
import { MatChipsModule} from '@angular/material/chips';
import { MatIcon} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Cuenta } from '../../../../models/Cuenta';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';
import { DialogData } from '../../../../models/Dialog-data';
import { MatDialog } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-registro-actualizacion-profesional',
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatChipsModule, MatIcon, MatSelectModule, MatRadioModule, MatCardModule, MatSnackBarModule, DatePipe, ReactiveFormsModule, FormsModule, NgIf],
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
  public nuevaFecha: string = '';
  public nuevaHoraInicio: string = '';
  public nuevaHoraFin: string = '';

  constructor( private fb: FormBuilder, private service: ServProfesionalesService, private servicioLogin: ServLoginService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog){
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ.\s]+$/), Validators.minLength(5), Validators.maxLength(50)]],
      especialidad: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.ubicacionConLetras]],
      fecha_Nacimiento: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      sexo: ['', Validators.required],
      disponibilidad: this.fb.control<string[]>([], [this.validarDisponibilidadMinima, this.validadFechaDisponibilidad]),
      correo: ['', [Validators.required, Validators.email]], 
      clave: ['', [Validators.required, Validators.minLength(8), this.formatoClave()]],
      foto: [null, this.isEdit ? [] : [Validators.required]]
    });
  }

  ngOnInit(): void {
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
    const fechaDate = this.convertirStringAFechaLocal(profesional.fecha_Nacimiento);

    this.form.patchValue({
      nombre: profesional.nombre,
      especialidad: profesional.especialidad,
      ubicacion: profesional.ubicacion,
      fecha_Nacimiento: fechaDate,
      telefono: profesional.telefono,
      sexo: profesional.sexo,
      disponibilidad: profesional.disponibilidad,
      foto: profesional.foto
    });

    if (this.isEdit && profesional.fotoBase64) {
      this.fotoPrevia = `data:image/png;base64,${profesional.fotoBase64}`;
      this.form.get('foto')?.setValue(this.fotoPrevia); 
    }

    if (this.isEdit) {
      this.form.get('correo')?.disable();
      this.form.get('clave')?.disable();
    }
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();

    if (this.isEdit) {
      this.confirmarActualizacion();
    } else {
      this.confirmarRegistro();
    }
  }

  confirmarRegistro(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Registro',
        message: '¿Estás seguro de que deseas registrar este profesional?',
        confirmText: 'Sí, registrar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.registrar(); // Confirmado
      }
    });
  }


  registrar(): void {
    const nuevoProfesional: Profesional = {
      nombre: this.form.value.nombre,
      especialidad: this.form.value.especialidad,
      ubicacion: this.form.value.ubicacion,
      fecha_Nacimiento: this.formatearFecha(this.form.value.fecha_Nacimiento),
      sexo: this.form.value.sexo,
      telefono: this.form.value.telefono,
      disponibilidad: this.form.value.disponibilidad.map((d: any) => ({
        fecha: d.fecha,
        horaInicio: d.horaInicio,
        horaFin: d.horaFin
      })),
      fotoBase64: this.form.value.foto?.includes('base64')
        ? this.form.value.foto.split(',')[1]
        : undefined
    };

    this.service.agregarProfesional(nuevoProfesional).subscribe({
      next: (response: any) => {
        const idGenerado = response.profesionalId;

        const nuevaCuenta: Cuenta = {
          email: this.form.value.correo,
          password: this.form.value.clave,
          rol: 'profesional',
          profesionalId: idGenerado
        };

        this.servicioLogin.registrarCuenta(nuevaCuenta).subscribe({
          next: () => {
            console.log('Registro exitoso: Profesional y cuenta creados correctamente.');
            this.router.navigate(['/login'], { replaceUrl: true });
          },
          error: (error) => {
            console.error('Error al registrar cuenta:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al registrar profesional:', error);
      }
    });
  }

  confirmarActualizacion(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Edición',
        message: '¿Estás seguro de que deseas guardar los cambios en este profesional?',
        confirmText: 'Sí, actualizar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.actualizar(); 
      }
    });
  }

  actualizar(): void {
    const fechaNacimiento: Date = this.form.value.fecha_Nacimiento;
    const fechaFormateada = fechaNacimiento.toISOString().split('T')[0]; 

    const updatedServicio: Profesional = {
      ...this.profesionalOriginal!,
      ...this.form.value,
      fecha_Nacimiento: fechaFormateada, 
      fotoBase64: this.form.value.foto?.includes('base64') ? this.form.value.foto.split(',')[1] : undefined
    };

    this.service.editarInformacionProfesional(updatedServicio).subscribe({
      next: () => {
        console.log('Actualización exitosa: Profesional actualizado correctamente.');
        this.router.navigate(['/profesional-dashboard'], { replaceUrl: true });
      },
      error: (error) => {
        console.error('Error al actualizar profesional:', error);
      }
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
        this.form.get('foto')?.setValue(this.fotoPrevia);
      };
      reader.readAsDataURL(file);
    }
  }

  agregarDisponibilidad() {
    if (!this.nuevaFecha || !this.nuevaHoraInicio || !this.nuevaHoraFin) return;

    const fecha = this.nuevaFecha;
    const horaInicio = this.nuevaHoraInicio;
    const horaFin = this.nuevaHoraFin;

    // Validar que la fecha no sea en el pasado
    const fechaHoraInicio = new Date(`${fecha}T${horaInicio}`);
    const ahora = new Date();
    if (fechaHoraInicio < ahora) {
      this.form.get('disponibilidad')?.setErrors({ fechaPasada: true });
      return;
    }

    // Validar que horaInicio < horaFin
    if (horaInicio >= horaFin) {
      alert('La hora de inicio debe ser menor que la hora de fin');
      return;
    }

    const lista = this.form.get('disponibilidad')?.value || [];

    const yaExiste = lista.some((d: any) =>
      d.fecha === fecha && d.horaInicio === horaInicio && d.horaFin === horaFin
    );

    if (!yaExiste) {
      const nuevaLista = [...lista, { id: 0, fecha, horaInicio, horaFin }];
      this.form.get('disponibilidad')?.setValue(nuevaLista);
      this.form.get('disponibilidad')?.markAsDirty();
      this.form.get('disponibilidad')?.setErrors(null);
    }

    // Limpiar los campos
    this.nuevaFecha = '';
    this.nuevaHoraInicio = '';
    this.nuevaHoraFin = '';
  }

  validarDisponibilidadMinima(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && value.length > 0 ? null : { required: true };
  }

  eliminarDisponibilidad(fecha: string) {
    const lista = this.form.get('disponibilidad')?.value || [];
    const nuevaLista = lista.filter((f: string) => f !== fecha);
    this.form.get('disponibilidad')?.setValue(nuevaLista);
    this.form.get('disponibilidad')?.markAsDirty(); 
  }

  validadFechaDisponibilidad(control: AbstractControl): ValidationErrors | null {
    const fecha = new Date(control.value);
    const hoy = new Date();
    fecha.setHours(0,0,0,0);
    hoy.setHours(0,0,0,0);

    return fecha < hoy ? { fechaPasada: true } : null;
  }

  isNoChanges(): boolean {
    if (!this.profesionalOriginal) return false;

    const original = {
      nombre: this.profesionalOriginal.nombre,
      especialidad: this.profesionalOriginal.especialidad,
      ubicacion: this.profesionalOriginal.ubicacion,
      fecha_Nacimiento: this.profesionalOriginal.fecha_Nacimiento,
      sexo: this.profesionalOriginal.sexo,
      telefono: this.profesionalOriginal.telefono,
      disponibilidad: this.profesionalOriginal.disponibilidad || [],
      foto: this.profesionalOriginal.foto
    };

    const current = this.form.value;
    const disponibilidadSinCambios = this.arraysSonIguales(
      original.disponibilidad,
      current.disponibilidad
    );


    return (
      original.nombre === current.nombre &&
      original.especialidad === current.especialidad &&
      original.ubicacion === current.ubicacion &&
      original.fecha_Nacimiento === current.fecha_Nacimiento &&
      original.sexo === current.sexo &&
      original.telefono === current.telefono &&
      disponibilidadSinCambios &&
      original.foto === current.foto
    );
  }

  private arraysSonIguales(arr1: any[], arr2: any[]): boolean {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();

    return sorted1.every((val, index) => val === sorted2[index]);
  }

  onCancel(): void {
    if (this.isEdit) {
      this.router.navigate(['/profesional-dashboard']); 
    } else {
      this.router.navigate(['/registrar']); 
    }
  }

  formatoClave(){
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+./_\-])[A-Za-z\d@$!%*?&+./_\-]{8,}$/;

      return regex.test(control.value) ? null : { formatoClave: true };
    };
  }

  convertirStringAFechaLocal(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ubicacionConLetras(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;

    const contieneLetra = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(valor);
    return contieneLetra ? null : { sinLetras: true };
  }
}
