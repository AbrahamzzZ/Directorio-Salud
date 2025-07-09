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

  // Permite eliminar la informacion de un profesional con su cuenta asociada
  eliminarProfesional(profesional: Profesional): Observable<void> {
    const url = `${this.apiUrl}/${profesional.id}`;
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        console.error('Error al eliminar profesional:', error);
        throw error;
      })
    );
  }
}
