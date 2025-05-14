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
    this.profesionalId = this.route.snapshot.paramMap.get('profesionalId') || '';
    this.usuarioId = this.servicioLogin.getIdentificador() ?? '';
  }

  onSubmit(): void {
    if (this.resenaForm.invalid) return;

    const nuevaResena: Resena = {
      ...this.resenaForm.value,
      profesionalId: this.profesionalId,
      usuarioId: this.usuarioId
    };

    this.servicioResena.addResena(nuevaResena).subscribe(() => {
      alert('Reseña registrada con éxito');
      this.router.navigate(['/patients-dashboard']); // Ajusta esto si quieres redirigir a otra vista
    });
  }

  onCancel(): void {
    this.router.navigate(['/patients-dashboard']); // o donde desees volver
  }

}
