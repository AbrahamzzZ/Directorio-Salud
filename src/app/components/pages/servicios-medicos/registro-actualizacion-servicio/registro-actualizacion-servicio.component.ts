import { Component } from '@angular/core';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServLoginService } from '../../../../services/serv-login.service';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';


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
    private router: Router
  ) {
    this.serviceForm = this.fb.group({
      // nombre: ['', Validators.required],
      // descripcion: ['', Validators.required],
      // precio: ['', [Validators.required, Validators.min(5)]],
      // fechaDisponible: ['', Validators.required],
      // requiereChequeo: [false]


      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(5), Validators.pattern(/^\d+(\.\d{0,2})?$/)]],
      fechaDisponible: ['', [Validators.required, this.dateNotInPastValidator(new Date())]], // Usamos la función que creamos antes
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

  onSubmit(): void {
    if (this.isEdit) {
      this.updateServicio();
    } else {
      this.addServicio();
    }
  }

  addServicio(): void {
    const profesionalId = this.servicioLogin.getIdentificador();
    const newServicio: ServicioMedico = {
      ...this.serviceForm.value,
      profesionalId: profesionalId ?? '', // agrega el ID del profesional
  };

    this.servicioService.addService(newServicio).subscribe(() => {
      alert("Servicio almacenado con exito!");
      this.router.navigate(['/my-services'], { replaceUrl: true }); // Redirige a la lista
    });
  }

  updateServicio(): void {
    const updatedServicio: ServicioMedico = {
      ...this.servicioOriginal!,
      ...this.serviceForm.value
    };
    this.servicioService.editService(updatedServicio).subscribe(() => {
      alert("Servicio editado con exito!");
    
      this.router.navigate(['/my-services'], { replaceUrl: true });

    });
  }

  isNoChanges(): boolean {
    // Verificar si no hubo cambios en el formulario
    return JSON.stringify(this.servicioOriginal) === JSON.stringify(this.serviceForm.value);
  }

  onCancel(): void {
    this.router.navigate(['/my-services']); // Redirigir al listado de servicios
  }
}
