import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServicioMedico } from '../../../../models/ServicioMedico';
import { Cita } from '../../../../models/Citas';
import { ServCitaService } from '../../../../services/servicio-cita/serv-cita.service';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ServLoginService } from '../../../../services/serv-login.service';
import { ServServiciosjsonService } from '../../../../services/servicio-servicios/serv-serviciosjson.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { DialogData } from '../../../../models/Dialog-data'; // Importa DialogData
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component'; // Importa DialogoComponent

@Component({
  selector: 'app-registro-actualizacion-cita',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
    HeaderComponent,
    FooterComponent,
    FooterComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    
  ],
  templateUrl: './registro-actualizacion-cita.component.html',
  styleUrls: ['./registro-actualizacion-cita.component.css'],
})
export class RegistroActualizacionCitaComponent implements OnInit {
  formularioCita: FormGroup;
  detallesServicio: ServicioMedico | null = null;
  esEdicion: boolean = false;
  idCitaActual: string | null = null;
  direccionesUnicas: string[] = [];
  prioridadesValidas: string[] = ['baja', 'media', 'alta'];

  constructor(
    private rutaActiva: ActivatedRoute,
    private constructorFormulario: FormBuilder,
    private servicioCita: ServCitaService,
    private enrutador: Router,
    private servicioLogin: ServLoginService,
    private servicioServicios: ServServiciosjsonService,
    private dialog: MatDialog // Inyecta MatDialog
  ) {
    this.formularioCita = this.constructorFormulario.group({
      direccion: ['', Validators.required],
      prioridad: [
        'media',
        [
          Validators.pattern(
            new RegExp(
              this.prioridadesValidas.map((p) => `^${p}$`).join('|'),
              'i'
            )
          ),
        ],
      ],
      metodoPago: ['efectivo', Validators.required],
      fechaHora: [''],
      estado: ['agendada'],
    });
  }

  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.idCitaActual = params.get('id');
      this.esEdicion = !!this.idCitaActual; // Si hay ID, estamos en edición
      if (this.esEdicion) {
        this.cargarCitaParaEdicion(this.idCitaActual!);
      } else {
        this.cargarDireccionesUnicas();
        this.cargarDetallesServicioParaNuevo(); // Cargar detalles si no es edición
      }
    });
  }

  cargarCitaParaEdicion(citaId: string): void {
    this.servicioCita.getCitaById(citaId).subscribe((cita) => {
      if (!this.direccionesUnicas.includes(cita.direccion)) {
        this.direccionesUnicas = [...this.direccionesUnicas, cita.direccion];
      }
      this.prellenarFormulario(cita);
      this.cargarDetallesServicioPorId(cita.servicioId!);
    });
  }
  cargarDireccionesUnicas(): void {
    this.servicioCita.getCitas().subscribe((citas) => {
      this.direccionesUnicas = [
        ...new Set(citas.map((cita) => cita.direccion)),
      ];
    });
  }

  cargarDetallesServicioPorId(servicioId: string): void {
    if (servicioId) {
      this.servicioServicios
        .getServiceById(servicioId)
        .subscribe((servicio) => {
          this.detallesServicio = servicio;
        });
    }
  }

  cargarDetallesServicioParaNuevo(): void {
    this.rutaActiva.queryParams.subscribe((params) => {
      this.detallesServicio = {
        id: params['id'],
        nombre: params['nombre'],
        descripcion: params['descripcion'],
        fechaDisponible: params['fechaDisponible'],
        precio: parseFloat(params['precio']),
        profesionalId: params['profesionalId'],
        requiereChequeo: params['requiereChequeo'] === 'true',
      } as ServicioMedico;
    });
  }

  prellenarFormulario(cita: Cita): void {
    this.formularioCita.patchValue({
      direccion: cita.direccion,
      prioridad: cita.prioridad,
      metodoPago: cita.metodoPago,
      fechaHora: cita.fechaHora,
      estado: cita.estado,
    });
  }

  enviarFormulario(): void {
    if (this.formularioCita.valid && this.detallesServicio?.id) {
      if (this.esEdicion && this.idCitaActual) {
        this.confirmarEdicionCita();
      } else {
        this.confirmarRegistroCita();
      }
    } else {
      console.log(
        'El formulario no es válido o no se recibieron los datos del servicio.'
      );
    }
  }

  confirmarRegistroCita(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Registro',
        message: '¿Estás seguro de que deseas registrar esta cita?',
        confirmText: 'Sí, registrar',
        cancelText: 'Cancelar',
        isConfirmation: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.createCita(); // Llama a tu función de creación de cita
      }
      // Si result es false o undefined, no hacemos nada -> se queda en el formulario
    });
  }

  confirmarEdicionCita(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Edición',
        message:
          '¿Estás seguro de que deseas guardar los cambios en esta cita?',
        confirmText: 'Sí, guardar',
        cancelText: 'Cancelar',
        isConfirmation: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.updateCita(); // Llama a tu función de actualización de cita
      }
      // Si result es false o undefined, no hacemos nada -> se queda en el formulario
    });
  }

  createCita(): void {
    const userId = this.servicioLogin.getIdentificador();
    const citaData = {
      ...this.formularioCita.value,
      servicioId: this.detallesServicio!.id,
      profesionalId: this.detallesServicio!.profesionalId,
      usuarioId: userId || 'Usuario no registrado',
      fechaHora:
        this.formularioCita.value.fechaHora || new Date().toISOString(),
    };

    this.servicioCita.createCita(citaData).subscribe(
      () => {
        this.enrutador.navigate(['/mantenimiento-paciente-cita'], {
          replaceUrl: true,
        });
      },
      (error) => {
        console.error('Error al registrar la cita:', error);
      }
    );
  }

  updateCita(): void {
    const citaData = {
      ...this.formularioCita.value,
      servicioId: this.detallesServicio!.id,
      profesionalId: this.detallesServicio!.profesionalId,
      id: this.idCitaActual!,
    };

    this.servicioCita.updateCita(citaData).subscribe(
      () => {
        this.enrutador.navigate(['/mantenimiento-paciente-cita'], {
          replaceUrl: true,
        });
      },
      (error) => {
        console.error('Error al actualizar la cita:', error);
      }
    );
  }

  onCancelar(): void {
    this.enrutador.navigate(['/mantenimiento-paciente-cita']);
  }
}
