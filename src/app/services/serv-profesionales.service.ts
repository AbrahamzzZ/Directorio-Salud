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
}
