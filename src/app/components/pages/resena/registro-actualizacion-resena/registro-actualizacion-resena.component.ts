import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServLoginService } from '../../../../services/serv-login.service';
import { ServResenasService } from '../../../../services/servicio-resena/serv-resenas.service';
import { Resena } from '../../../../models/Resena';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../../models/Dialog-data';
import { DialogoComponent } from '../../../shared/dialogo/dialogo.component';

@Component({
  selector: 'app-registro-actualizacion-resena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent, MatFormFieldModule,
    MatInputModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './registro-actualizacion-resena.component.html',
  styleUrl: './registro-actualizacion-resena.component.css'
})
export class RegistroActualizacionResenaComponent {

  resenaForm: FormGroup;
  profesionalId: string = '';
  usuarioId: string = '';
  resenaId: string | null = null;
  resenaOriginal: Resena | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private servicioResena: ServResenasService,
    private servicioLogin: ServLoginService,
    private dialog: MatDialog
  ) {
    this.resenaForm = this.fb.group({
      comentario: ['', Validators.required],
      calificacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      recomienda: [false],
      motivoVisita: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.resenaId = this.route.snapshot.paramMap.get('id');
    this.profesionalId = this.route.snapshot.paramMap.get('profesionalId') || '';
    this.usuarioId = this.servicioLogin.getIdentificador() ?? '';

    if (this.resenaId) {
      this.isEdit = true;
      this.servicioResena.getResenaById(this.resenaId).subscribe(resena => {
        this.resenaOriginal = resena;
        this.populateForm(resena);
      });
    }
  }

  populateForm(resena: Resena): void {
    this.resenaForm.patchValue({
      comentario: resena.comentario,
      calificacion: resena.calificacion,
      recomienda: resena.recomienda,
      motivoVisita: resena.motivoVisita
    });
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();

    if (this.resenaForm.invalid) return;

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
        message: '¿Estás seguro de que deseas registrar esta reseña?',
        confirmText: 'Sí, registrar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.registrarResena();
      }
    });
  }

  registrarResena(): void {
    const nuevaResena: Resena = {
      ...this.resenaForm.value,
      profesionalId: this.profesionalId,
      usuarioId: this.usuarioId,
      fechaResena: new Date().toISOString().split('T')[0]
    };

    this.servicioResena.addResena(nuevaResena).subscribe(() => {
      this.router.navigate(['/patients-dashboard'], { replaceUrl: true });
    });
  }

  confirmarEdicion(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: <DialogData>{
        title: 'Confirmar Edición',
        message: '¿Estás seguro de que deseas actualizar esta reseña?',
        confirmText: 'Sí, actualizar',
        cancelText: 'Cancelar',
        isConfirmation: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.updateResena();
      }
    });
  }

  updateResena(): void {
    const updatedResena: Resena = {
      ...this.resenaOriginal!,
      ...this.resenaForm.value
    };

    this.servicioResena.editResena(updatedResena).subscribe(() => {
      this.router.navigate(['mantenimiento-resena'], { replaceUrl: true });
    });
  }

  isNoChanges(): boolean {
    if (!this.resenaOriginal) return false;

    const original = {
      comentario: this.resenaOriginal.comentario,
      calificacion: this.resenaOriginal.calificacion,
      recomienda: this.resenaOriginal.recomienda,
      motivoVisita: this.resenaOriginal.motivoVisita
    };

    const current = this.resenaForm.value;

    return (
      original.comentario === current.comentario &&
      original.calificacion === current.calificacion &&
      original.recomienda === current.recomienda &&
      original.motivoVisita === current.motivoVisita
    );
  }

  onCancel(): void {
    this.router.navigate(['mantenimiento-resena']);
  }
}
