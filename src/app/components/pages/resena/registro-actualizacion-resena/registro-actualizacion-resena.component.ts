import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServLoginService } from '../../../../services/serv-login.service';
import { ServResenasService } from '../../../../services/serv-resenas.service';
import { Resena } from '../../../../models/Resena';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-registro-actualizacion-resena',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
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
    private servicioLogin: ServLoginService
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

  onSubmit(): void {
    if (this.resenaForm.invalid) return;

    if (this.isEdit) {
      this.updateResena();
    } else {
      this.addResena();
    }
  }

  addResena(): void {
    const nuevaResena: Resena = {
      ...this.resenaForm.value,
      profesionalId: this.profesionalId,
      usuarioId: this.usuarioId
    };

    this.servicioResena.addResena(nuevaResena).subscribe(() => {
      alert('Reseña registrada con éxito');
      this.router.navigate(['/patients-dashboard']);
    });
  }

  updateResena(): void {
    const updatedResena: Resena = {
      ...this.resenaOriginal!,
      ...this.resenaForm.value
    };

    this.servicioResena.editResena(updatedResena).subscribe(() => {
      alert('Reseña actualizada con éxito');
      this.router.navigate(['/patients-dashboard']);
    });
  }

  isNoChanges(): boolean {
    return JSON.stringify(this.resenaOriginal) === JSON.stringify(this.resenaForm.value);
  }

  onCancel(): void {
    this.router.navigate(['/patients-dashboard']);
  }
}