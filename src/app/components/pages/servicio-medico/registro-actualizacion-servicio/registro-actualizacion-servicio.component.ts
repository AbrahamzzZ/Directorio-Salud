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
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-registro-actualizacion-servicio',
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatIconModule, MatButtonModule, UpperCasePipe],
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
    // Verificar si estamos en modo edición
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
        // Establecer las horas a 0 para comparar solo las fechas
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
        this.registrarServicio(); // Confirmado
      }
      // Si result es false o undefined, no hacemos nada
    });
  }

  registrarServicio(): void {
    const profesionalId = this.servicioLogin.getIdentificador();
    const newServicio: ServicioMedico = {
      ...this.serviceForm.value,
      profesionalId: profesionalId ?? '', // agrega el ID del profesional
  };

    this.servicioService.addService(newServicio).subscribe(() => {
      this.router.navigate(['/my-services'], { replaceUrl: true }); // Redirige a la lista
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
        this.updateServicio(); // Confirmado
      }
      // Si result es false o undefined, no hacemos nada
    });
  }

  updateServicio(): void {
    const updatedServicio: ServicioMedico = {
      ...this.servicioOriginal!,
      ...this.serviceForm.value
    };
    this.servicioService.editService(updatedServicio).subscribe(() => {
      this.router.navigate(['/my-services'], { replaceUrl: true });
    });
  }

  isNoChanges(): boolean {
    // Verificar si no hubo cambios en el formulario
   if (!this.servicioOriginal) return false;

    const original = {
      nombre: this.servicioOriginal.nombre,
      descripcion: this.servicioOriginal.descripcion,
      precio: this.servicioOriginal.precio,
      fechaDisponible: this.servicioOriginal.fechaDisponible,
      requiereChequeo: this.servicioOriginal.requiereChequeo
    };

    const current = this.serviceForm.value;

    // Normalizar las fechas para comparar solo la parte de la fecha (sin hora)
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
    this.router.navigate(['/my-services']); // Redirigir al listado de servicios
  }
}
