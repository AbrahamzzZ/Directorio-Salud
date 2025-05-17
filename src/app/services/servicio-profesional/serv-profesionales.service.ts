import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, mapTo, Observable } from 'rxjs';
import { Profesional } from '../../models/Profesional';
import { ServLoginService } from '../serv-login.service';

@Injectable({
  providedIn: 'root'
})
export class ServProfesionalesService {

  private jsonUrl = 'http://localhost:3000/profesionales';

  constructor(private http: HttpClient, private login: ServLoginService) {}

  // Obtener todos los profesionales
  getProfesionales(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(this.jsonUrl);
  }

  // Obtener solo el profesional que ha iniciado sesión
  getProfesionalPorId(id: string): Observable<Profesional | undefined> {
    return this.getProfesionales().pipe(
      map(profesionales => profesionales.find(p => p.id === id))
    );
  }

  // Obtener un profesional mediante su id
  obtenerprofesionalID(id: string): Observable<Profesional>{
    return this.http.get<Profesional>(`${this.jsonUrl}/${id}`);
  }

  // Permite buscar al profesional por su nombre, especialidad y ubicacion
  buscarProfesional(profesional: string): Observable<Profesional[]>{
    /*return this.http.get<Profesional[]>(`${this.jsonUrl}`).pipe(
      map((servicios) =>
        servicios.filter((serv) =>
          serv.nombre.toLowerCase().includes(profesional.toLowerCase()) ||
          serv.especialidad.toLowerCase().includes(profesional.toLowerCase()) ||
          serv.ubicacion.toLowerCase().includes(profesional.toLowerCase())  ||
          serv.disponibilidad.includes(profesional.toLowerCase())
        )
      )
    );*/
    const criterio = profesional.trim().toLowerCase();
    
    return this.http.get<Profesional[]>(`${this.jsonUrl}`).pipe(
      map((servicios) =>
        servicios.filter((serv) =>
          serv.nombre.toLowerCase().includes(criterio) ||
          serv.especialidad.toLowerCase().includes(criterio) ||
          serv.ubicacion.toLowerCase().includes(criterio) ||
          serv.disponibilidad.some(d => d.toLowerCase().includes(criterio))
        )
      )
    );
  }

  // Permite agregar un nuevo profesional
  agregarProfesional(profesional: Profesional): Observable<Profesional>{
    return this.http.post<Profesional>(this.jsonUrl, profesional)
  }

  // Permite editar la información de un profesional
  editarInformacionProfesional(profesional: Profesional): Observable<Profesional>{
    return this.http.put<Profesional>(`${this.jsonUrl}/${profesional.id}`, profesional)
  }

  // Permite eliminar un profesional
  eliminarProfesional(profesional: Profesional): Observable<void> {
    return forkJoin({
        profesional: this.http.delete<void>(`${this.jsonUrl}/${profesional.id}`),
        cuenta: this.login.eliminarCuenta(profesional.id)
    }).pipe(
        mapTo(void 0),
        catchError(error => {
            console.error('Error al eliminar profesional y cuenta:', error);
            throw error;
        })
    );
  }
}
