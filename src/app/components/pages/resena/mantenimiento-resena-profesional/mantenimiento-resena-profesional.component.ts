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
    this.resenasService.getResenasByProfesional(this.profesionalId).subscribe({
      next: (data) => {
        this.resenas = data;
      },
      error: (err) => {
        console.error('Error cargando reseñas del profesional', err);
      }
    });
  }

}

