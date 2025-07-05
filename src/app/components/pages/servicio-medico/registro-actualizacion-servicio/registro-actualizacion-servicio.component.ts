import { Component } from '@angular/core';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServLoginService } from '../../../../services/serv-login.service';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../../models/Dialog-data';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';

@Component({
  selector: 'app-registro-actualizacion-servicio',
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './registro-actualizacion-servicio.component.html',
  styleUrl: './registro-actualizacion-servicio.component.css'
})
export class RegistroActualizacionServicioComponent {
  serviceForm: FormGroup;
  isEdit = false;
  servicioId: string | null = null;
  servicioOriginal: ServicioMedico | null = null;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServServiciosjsonService,
    private servicioLogin: ServLoginService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.serviceForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      fechaDisponible: ['', Validators.required],
      requiereChequeo: [false]
    });
  }

  ngOnInit(): void {
    this.servicioId = this.route.snapshot.paramMap.get('id');
    if (this.servicioId) {
      this.isEdit = true;
      this.servicioService.getServiceById(this.servicioId).subscribe(servicio => {
        this.servicioOriginal = servicio; 
        this.populateForm(servicio);
      });
    }
  }
  
  dateNotInPastValidator(minDate: Date) {
      return (control: AbstractControl) => {
        const selectedDate = new Date(control.value);
        selectedDate.setHours(0, 0, 0, 0);
        minDate.setHours(0, 0, 0, 0);
        return selectedDate >= minDate ? null : { 'dateInPast': true };
      };
  }

  populateForm(servicio: ServicioMedico): void {
    this.serviceForm.patchValue({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      fechaDisponible: servicio.fechaDisponible,
      requiereChequeo: servicio.requiereChequeo
    });
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();

    if (this.isEdit) {
      this.confirmarEdicion();
    } else {
      this.confirmarRegistro();
    }
  }

  confirmarRegistro(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Registro',
        message: '¿Estás seguro de que deseas registrar este servicio?',
        confirmText: 'Sí, registrar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.registrarServicio(); 
      }
    });
  }

  registrarServicio(): void {
    // const profesionalId = this.servicioLogin.getIdentificador();
    const profesionalId = Number(this.servicioLogin.getIdentificador());
    const newServicio: ServicioMedico = {
      ...this.serviceForm.value,
      profesionalId: profesionalId, // ya es número
    };

    this.servicioService.addService(newServicio).subscribe(() => {
      this.router.navigate(['/my-services'], { replaceUrl: true }); 
    });

  }

  confirmarEdicion(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Edición',
        message: '¿Estás seguro de que deseas guardar los cambios en este servicio?',
        confirmText: 'Sí, actualizar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.updateServicio(); 
      }
    });
  }

  updateServicio(): void {
    const updatedServicio: ServicioMedico = {
      ...this.servicioOriginal!,
      ...this.serviceForm.value
    };
    this.servicioService.editService(updatedServicio).subscribe({
    next: () => {
      this.router.navigate(['/my-services'], { replaceUrl: true });
    },
    error: (err) => {
      console.error('Error en actualización:', err);
      if (err.error && err.error.errors) {
        console.log('Errores de validación:', err.error.errors);
        // Opcional: aquí podrías mostrar los errores en la UI, por ejemplo asignarlos a una variable para mostrarlos en el template
      } else if (err.error && err.error.message) {
        console.log('Mensaje de error:', err.error.message);
      }
    }
  });

  }

  isNoChanges(): boolean {
  if (!this.servicioOriginal) return false;

    const original = {
      nombre: this.servicioOriginal.nombre,
      descripcion: this.servicioOriginal.descripcion,
      precio: this.servicioOriginal.precio,
      fechaDisponible: this.servicioOriginal.fechaDisponible,
      requiereChequeo: this.servicioOriginal.requiereChequeo
    };

    const current = this.serviceForm.value;

    const originalDate = new Date(original.fechaDisponible).toISOString().split('T')[0];
    const currentDate = new Date(current.fechaDisponible).toISOString().split('T')[0];

    return (
      original.nombre === current.nombre &&
      original.descripcion === current.descripcion &&
      Number(original.precio) === Number(current.precio) &&
      originalDate === currentDate &&
      original.requiereChequeo === current.requiereChequeo
    );
  }

  onCancel(): void {
    this.router.navigate(['/my-services']); 
  }
}
