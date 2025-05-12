import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { ServServiciosjsonService } from '../../../../services/serv-serviciosjson.service';
import { ServCitaService } from '../../../../services/serv-cita.service';
import { NgFor } from '@angular/common';




@Component({
  selector: 'app-registro-actualizacion-cita',
  templateUrl: './registro-actualizacion-cita.component.html',
  styleUrls: ['./registro-actualizacion-cita.component.css'],
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, NgFor]
})
export class RegistroActualizacionCitaComponent implements OnInit {
  citaForm: FormGroup;
  servicioSeleccionado: any;
  direccionesDisponibles: string[] = [];
  metodosPago = ['Efectivo', 'Transferencia', 'Tarjeta'];
  servicioIdSeleccionado: string = '';
  direccionUnica: string | null = null;



  constructor(
   private fb: FormBuilder,
  private router: Router,
  private servicioCitas: ServCitaService
  ) {
    this.citaForm = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      descripcion: [{ value: '', disabled: true }],
      precio: [{ value: '', disabled: true }],
      fechaDisponible: [{ value: '', disabled: true }],
      direccion: ['', Validators.required],
      metodoPago: ['', Validators.required],
      prioridad: ['', Validators.required]
    });
  }

 ngOnInit(): void {
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras?.state as { servicio?: ServicioMedico };

  if (state?.servicio) {
    this.servicioSeleccionado = state.servicio;
    if (!state.servicio?.id) {
      console.error('El servicio no tiene ID');
      return;
    }
    this.servicioIdSeleccionado = state.servicio.id;
    this.citaForm.patchValue({
      nombre: state.servicio.nombre,
      descripcion: state.servicio.descripcion,
      precio: state.servicio.precio,
      fechaDisponible: state.servicio.fechaDisponible
    });

    this.servicioCitas.getCitas().subscribe(citas => {
      const cita = citas.find(c => c.servicioId === this.servicioIdSeleccionado);
      this.direccionUnica = cita?.direccion ?? null;

      if (this.direccionUnica) {
        this.citaForm.patchValue({ direccion: this.direccionUnica });
      }
    });
  }
}



  onSubmit(): void {
    if (this.citaForm.valid) {
      const cita = {
        ...this.servicioSeleccionado,
        ...this.citaForm.getRawValue(), // incluye los valores readonly
        servicioId: this.servicioSeleccionado.id,
        profesionalId: this.servicioSeleccionado.profesionalId,
        usuarioId: 2, // Aquí deberías traer el ID del usuario logueado
        estado: 'agendada',
        fechaHora: this.servicioSeleccionado.fechaDisponible
      };

      console.log('Cita a guardar:', cita);

      // Aquí deberías guardar la cita en tu JSON usando un servicio
    }
  }

  onCancel(): void {
    this.router.navigate(['/servicios']);
  }
}
