import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Profesional } from '../models/Profesional';

@Injectable({
  providedIn: 'root'
})
export class ServProfesionalesService {

  private jsonUrl = 'http://localhost:3000/profesionales';

  constructor(private http: HttpClient) {}

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
    return this.http.get<Profesional[]>(`${this.jsonUrl}`).pipe(
      map((servicios) =>
        servicios.filter((serv) =>
          serv.nombre.toLowerCase().includes(profesional.toLowerCase()) ||
          serv.especialidad.toLowerCase().includes(profesional.toLowerCase()) ||
          serv.ubicacion.toLowerCase().includes(profesional.toLowerCase())
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
  eliminarProfesional(profesional:Profesional):Observable<void>{
    return this.http.delete<void>(`${this.jsonUrl}/${profesional.id}`);
  }
}
