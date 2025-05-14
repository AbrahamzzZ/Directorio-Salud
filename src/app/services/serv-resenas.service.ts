import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Resena } from '../models/Resena';
import { ServLoginService } from './serv-login.service';


@Injectable({
  providedIn: 'root'
})
export class ServResenasService {
  private jsonUrl = "http://localhost:3000/resenas";


  constructor(private http: HttpClient, private servicioLogin: ServLoginService) { }

  addResena(resena: Resena): Observable<Resena> {
    return this.http.post<Resena>(this.jsonUrl, resena);
  }
  
  getResenasByPaciente(): Observable<Resena[]> {
    const id = String(this.servicioLogin.getIdentificador());
    return this.http.get<Resena[]>(`${this.jsonUrl}?pacienteId=${id}`);
  }

  searchResenasByPaciente(termino: string): Observable<Resena[]> {
    const id = String(this.servicioLogin.getIdentificador());
    return this.http.get<Resena[]>(`${this.jsonUrl}?usuarioId=${id}`).pipe(
      map((resenas) =>
        resenas.filter((r) =>
          r.motivoVisita.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }

}
