import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resena } from '../../../../models/Resena';
import { ServResenasService } from '../../../../services/servicio-resena/serv-resenas.service';
import { ServLoginService } from '../../../../services/serv-login.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Profesional } from '../../../../models/Profesional';

import { forkJoin, map } from 'rxjs';
import { ServProfesionalesService } from '../../../../services/servicio-profesional/serv-profesionales.service';

interface ResenaConNombre extends Resena {
  nombreProfesional?: string;
}

@Component({
  selector: 'app-mantenimiento-resena',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule],
  templateUrl: './mantenimiento-resena.component.html',
  styleUrl: './mantenimiento-resena.component.css'
})
export class MantenimientoResenaComponent {

  displayedColumns: string[] = ['nombreProfesional', 'motivoVisita', 'comentario', 'calificacion', 'recomienda', 'acciones'];
  dataSource = new MatTableDataSource<ResenaConNombre>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private servResena: ServResenasService,
    private servProfesional: ServProfesionalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarResenas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarResenas(): void {
    this.servResena.getResenasByPaciente().subscribe((resenas) => {
      const peticiones = resenas.map(resena =>
        this.servProfesional.getProfesionalPorId(resena.profesionalId!).pipe(
          map((profesional) => ({
            ...resena,
            nombreProfesional: profesional?.nombre || 'Desconocido'
          }))
        )
      );

      forkJoin(peticiones).subscribe((resenasConNombre: ResenaConNombre[]) => {
        this.dataSource.data = resenasConNombre;
      });
    });
  }

  search(input: HTMLInputElement) {
    const termino = input.value.trim();
    if (termino) {
      this.servResena.searchResenasByPaciente(termino).subscribe((resenas) => {
        const peticiones = resenas.map(resena =>
          this.servProfesional.getProfesionalPorId(resena.profesionalId!).pipe(
            map((profesional) => ({
              ...resena,
              nombreProfesional: profesional?.nombre || 'Desconocido'
            }))
          )
        );

        forkJoin(peticiones).subscribe((resenasConNombre: ResenaConNombre[]) => {
          this.dataSource.data = resenasConNombre;
        });
      });
    } else {
      this.cargarResenas();
    }
  }

  editar(resena: Resena) {
    this.router.navigate(['/resena-edit', resena.id]);
  }

  eliminar(resena: Resena) {
    const confirmado = confirm(`¿Estás seguro de eliminar la reseña con motivo: "${resena.motivoVisita}"?`);
    if (confirmado) {
      this.servResena.deleteResena(resena).subscribe(() => {
        alert('Reseña eliminada correctamente');
        this.cargarResenas();
      });
    }
  }

  
}