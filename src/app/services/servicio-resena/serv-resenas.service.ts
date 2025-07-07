import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Resena } from '../../models/Resena';
import { ServLoginService } from '../serv-login.service';

@Injectable({
  providedIn: 'root'
})
export class ServResenasService {
  private apiUrl = 'http://localhost:5195/api/Resena';

  constructor(private http: HttpClient, private servicioLogin: ServLoginService) { }

  // (Modo Paciente ) - Registrar Reseña
  // POST: /api/Resena
  addResena(resenaData: Omit<Resena, 'id' | 'fechaResena'>): Observable<Resena> {
    return this.http.post<Resena>(this.apiUrl, resenaData);
  }

  // (Modo Paciente ) - Obtener reseñas de un paciente
  // GET: /api/Resena/paciente/{id}  <-- ¡Ruta corregida!
  getResenasByPaciente(): Observable<Resena[]> {
    const id = this.servicioLogin.getIdentificador(); 
    if (!id) {
        console.error('ServResenasService: ID de paciente no disponible para getResenasByPaciente.');
        return new Observable(); // O throwError de rxjs
    }
    return this.http.get<Resena[]>(`${this.apiUrl}/paciente/${id}`);
  }

  // (Modo Paciente ) - Editar Reseña
  // PUT: /api/Resena/{id}
  editResena(resena: Resena): Observable<Resena> {
    return this.http.put<Resena>(`${this.apiUrl}/${resena.id}`, resena);
  }

  // Obtener una Reseña por su ID (para edición o detalles)
  // GET: /api/Resena/{id}
  getResenaById(id: string): Observable<Resena> {
    return this.http.get<Resena>(`${this.apiUrl}/${id}`);
  }

  // (Modo Profesional ) - Obtener reseñas recibidas por un profesional
  // GET: /api/Resena/profesional/{profesionalId}
  getResenasByProfesional(profesionalId: string): Observable<Resena[]> {
    if (!profesionalId) {
        console.error('ServResenasService: ID de profesional no disponible para getResenasByProfesional.');
        return new Observable();
    }
    return this.http.get<Resena[]>(`${this.apiUrl}/profesional/${profesionalId}`);
  }

  // (Modo Paciente - Administrador) - Eliminar Reseña
  // DELETE: /api/Resena/{id}
  deleteResena(resena: Resena): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resena.id}`);
  }

  // Obtener todas las reseñas (modo administrador)
  // GET: /api/Resena/all  <-- ¡Ruta corregida!
  getResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/all`);
  }

  searchResenasByPaciente(termino: string): Observable<Resena[]> {
    const id = String(this.servicioLogin.getIdentificador());
    return this.http.get<Resena[]>(`${this.apiUrl}?usuarioId=${id}`).pipe(
      map((resenas) =>
        resenas.filter((r) =>
          r.motivoVisita.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }

  // Búsqueda general por término (modo administrador)
  /*searchResenas(termino: string): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.apiUrl).pipe(
      map((resenas) =>
        resenas.filter((r) =>
          r.motivoVisita.toLowerCase().includes(termino.toLowerCase()) ||
          r.comentario?.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }*/
  searchResenas(termino: string): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/search?termino=${termino}`);
  }
}