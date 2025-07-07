import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, mapTo, Observable, switchMap } from 'rxjs';
import { Profesional } from '../../models/Profesional';
import { ServLoginService } from '../serv-login.service';

@Injectable({
  providedIn: 'root'
})
export class ServProfesionalesService {

  private apiUrl = 'http://localhost:5195/api/Profesional';

  constructor(private http: HttpClient, private login: ServLoginService) {}

  // Obtener todos los profesionales
  getProfesionales(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(this.apiUrl);
  }

  // Obtener solo el profesional que ha iniciado sesión
  getProfesionalPorId(id: string): Observable<Profesional | undefined> {
    return this.getProfesionales().pipe(
      map(profesionales => profesionales.find(p => p.id === id))
    );
  }

  // Obtener un profesional mediante su id
  obtenerprofesionalID(id: string): Observable<Profesional>{
    return this.http.get<Profesional>(`${this.apiUrl}/${id}`);
  }

  // Permite buscar al profesional por su nombre, especialidad y ubicacion
  buscarProfesionales(nombre?: string, especialidad?: string, ubicacion?: string): Observable<Profesional[]> {
    let params = new HttpParams();

    if (nombre) params = params.set('nombre', nombre);
    if (especialidad) params = params.set('especialidad', especialidad);
    if (ubicacion) params = params.set('ubicacion', ubicacion);

    return this.http.get<Profesional[]>(`${this.apiUrl}/buscar`, { params });
  }

  // Permite agregar un nuevo profesional
  agregarProfesional(profesional: Profesional): Observable<Profesional>{
    return this.http.post<Profesional>(this.apiUrl, profesional)
  }

  // Permite editar la información de un profesional
  editarInformacionProfesional(profesional: Profesional): Observable<Profesional> {
    return this.http.put<Profesional>(`${this.apiUrl}/${profesional.id}`, profesional);
  }

  eliminarProfesional(profesional: Profesional): Observable<void> {
    const serviciosUrl = 'http://localhost:5195/api/ServicioMedico';
    const citasUrl = 'http://localhost:3000/citas';
    const resenasUrl = 'http://localhost:5195/api/Resena';

    // Paso 1: Obtener servicios, citas y reseñas asociadas al profesional
    const servicios$ = this.http.get<any[]>(serviciosUrl).pipe(
      map(servicios => servicios.filter(s => s.profesionalId === profesional.id))
    );

    const citas$ = this.http.get<any[]>(citasUrl).pipe(
      map(citas => citas.filter(c => c.profesionalId === profesional.id))
    );

    const resenas$ = this.http.get<any[]>(resenasUrl).pipe(
      map(resenas => resenas.filter(r => r.profesionalId === profesional.id))
    );

    // Paso 2: Eliminar profesional, cuenta, servicios, citas y reseñas asociados
    return forkJoin([servicios$, citas$, resenas$]).pipe(
      switchMap(([serviciosFiltrados, citasFiltradas, resenasFiltradas]) => {
        const eliminacionesServicios = serviciosFiltrados.map(s =>
          this.http.delete(`${serviciosUrl}/${s.id}`)
        );

        const eliminacionesCitas = citasFiltradas.map(c =>
          this.http.delete(`${citasUrl}/${c.id}`)
        );

        const eliminacionesResenas = resenasFiltradas.map(r =>
          this.http.delete(`${resenasUrl}/${r.id}`)
        );

        return forkJoin([
          this.http.delete(`${this.apiUrl}/${profesional.id}`),
          this.login.eliminarCuenta(profesional.id!),
          ...eliminacionesServicios,
          ...eliminacionesCitas,
          ...eliminacionesResenas
        ]).pipe(
          mapTo(void 0)
        );
      }),
      catchError(error => {
        console.error('Error al eliminar profesional, cuenta, servicios, citas y reseñas:', error);
        throw error;
      })
    );
  }
}
