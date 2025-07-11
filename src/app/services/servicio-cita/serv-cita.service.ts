import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Cita } from '../../models/Citas';
import { ServProfesionalesService } from '../servicio-profesional/serv-profesionales.service';
import { ServServiciosjsonService } from '../servicio-servicios/serv-serviciosjson.service';



@Injectable({
  providedIn: 'root',
})
export class ServCitaService {
  private apiUrl: string = 'http://localhost:5195/api/Cita';

  constructor(
    private http: HttpClient,
    private servServiciosMedicos: ServServiciosjsonService,
    private servProf: ServProfesionalesService
  ) {}

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  getCitaById(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  createCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  updateCita(cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${cita.id}`, cita);
  }

  deleteCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCitasDetalladasPorPaciente(pacienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  getCitasDetalladasPorProfesional(profesionalId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesional/${profesionalId}`);
  }
  verificarCitaExistente(pacienteId: string, servicioId: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(
      `${this.apiUrl}/verificar-existente?pacienteId=${pacienteId}&servicioId=${servicioId}`
    );
  }
}
