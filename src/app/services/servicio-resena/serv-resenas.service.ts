import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Resena } from '../../models/Resena';
import { ServLoginService } from '../serv-login.service';

@Injectable({
  providedIn: 'root'
})
export class ServResenasService {
  private apiUrl = 'http://localhost:5195/api/Resena';

  constructor(private http: HttpClient, private servicioLogin: ServLoginService) { }

  // (Modo Paciente)
  addResena(resenaData: Omit<Resena, 'id' | 'fechaResena'>): Observable<Resena> {
    return this.http.post<Resena>(this.apiUrl, resenaData);
  }

  // se usa para edit
  getResenaById(id: string): Observable<Resena> {
    return this.http.get<Resena>(`${this.apiUrl}/${id}`);
  }

  // (Modo Paciente)
  editResena(resena: Resena): Observable<Resena> {
    return this.http.put<Resena>(`${this.apiUrl}/${resena.id}`, resena);
  }

  // (Modo Paciente - Administrador)
  deleteResena(resena: Resena): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resena.id}`);
  }

  // (Modo Paciente - Profesional - Administrador)
  searchResenas(termino: string, profesionalId?: string, pacienteId?: string): Observable<Resena[]> {
    let params = new HttpParams();
    if (termino && termino.trim() !== '') {
      params = params.set('termino', termino.trim());
    }
    if (profesionalId) {
      params = params.set('profesionalId', profesionalId);
    }
    if (pacienteId) {
      params = params.set('pacienteId', pacienteId);
    }
    return this.http.get<Resena[]>(`${this.apiUrl}/search`, { params });
  }
}