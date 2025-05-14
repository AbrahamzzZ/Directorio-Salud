import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServServiciosjsonService } from './serv-serviciosjson.service';
import { ServProfesionalesService } from './serv-profesionales.service';
import {  Observable } from 'rxjs';
import { Cita } from '../models/Citas';


@Injectable({
  providedIn: 'root'
})
export class ServCitaService {
private jsonUrl:string = "http://localhost:3000/citas";

  constructor(private http:HttpClient, private servServiciosMedicos:ServServiciosjsonService, private servProf:ServProfesionalesService) { }

// Obtener todas las citas
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.jsonUrl);
  }

  // Obtener una cita por ID
  getCitaById(id: string): Observable<Cita> {
    return this.http.get<Cita>(`${this.jsonUrl}/${id}`);
  }

  // Crear una nueva cita
  createCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.jsonUrl, cita);
  }

  // Actualizar una cita existente
  updateCita(cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.jsonUrl}/${cita.id}`, cita);
  }

  // Eliminar una cita

  //deleteCita(cita:Cita):Observable<void>{
 //   return this.http.delete<void>(`${this.jsonUrl}/${cita.id}`);
  //}

   // Eliminar una cita por el id
  deleteCita(id: string): Observable<void> {
    return this.http.delete<void>(`${this.jsonUrl}/${id}`);
  }
  

  
}
