import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resena } from '../../../../models/Resena';
import { ServResenasService } from '../../../../services/servicio-resena/serv-resenas.service';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mantenimiento-resena-profesional',
  imports: [CommonModule, HeaderComponent, FooterComponent, MatCardModule, MatIconModule, 
    MatFormFieldModule, MatInputModule],
  templateUrl: './mantenimiento-resena-profesional.component.html',
  styleUrl: './mantenimiento-resena-profesional.component.css'
})
export class MantenimientoResenaProfesionalComponent {

  resenas: Resena[] = [];
  profesionalId: string = '';

  constructor(
    private route: ActivatedRoute,
    private resenasService: ServResenasService
  ) {}

  ngOnInit(): void {
    this.profesionalId = this.route.snapshot.paramMap.get('profesionalId') || '';
    this.cargarResenas();
  }

  cargarResenas(): void {
    if (!this.profesionalId || this.profesionalId === 'null' || this.profesionalId === 'undefined' || this.profesionalId.trim() === '') {
      console.warn('ID de profesional no encontrado o inválido en la ruta. No se pueden cargar reseñas.');
      this.resenas = []; 
      return;
    }

    this.resenasService.searchResenas('', this.profesionalId, undefined).subscribe({
      next: (data: Resena[]) => { 
        this.resenas = data;
      },
      error: (err: HttpErrorResponse) => { 
        console.error('Error cargando reseñas del profesional:', err);
        this.resenas = []; 
      }
    });
  }
}

