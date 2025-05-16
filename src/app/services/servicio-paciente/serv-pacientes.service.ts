import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../../models/Paciente';
import { catchError, forkJoin, map, mapTo, Observable } from 'rxjs';
import { ServLoginService } from '../serv-login.service';

@Injectable({
  providedIn: 'root'
})
export class ServPacientesService {

  private jsonUrl = 'http://localhost:3000/pacientes';

  constructor(private http: HttpClient, private login: ServLoginService) {}
 
  getpacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.jsonUrl);
  }  
    
  getpacientesSearch(nombre:string):Observable<Paciente[]>{
    return this.http.get<Paciente[]>(this.jsonUrl).pipe(
      map((pacientes)=>
        pacientes.filter((paciente)=>
        (nombre ? paciente.nombre.toLocaleLowerCase().includes(nombre.toLocaleLowerCase()):true) 
        )  
      )  
    );
  }  

  getPacientePorId(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.jsonUrl}/${id}`);
  }

   //agregar
  addPatient(paciente:Paciente):Observable<Paciente>{    
    return this.http.post<Paciente>(this.jsonUrl, paciente);      
  }
  
  //editar
  editPatient(paciente:Paciente):Observable<Paciente>{   
    const urlDelPaciente =`${this.jsonUrl}/${paciente.id}`;
    return this.http.put<Paciente>(urlDelPaciente, paciente);      
  }

  //eliminar
  deletePatient(paciente:Paciente):Observable<void>{    
    return forkJoin({
        profesional: this.http.delete<void>(`${this.jsonUrl}/${paciente.id}`),
        cuenta: this.login.eliminarCuenta(paciente.id)
    }).pipe(
        mapTo(void 0),
        catchError(error => {
            console.error('Error al eliminar profesional y cuenta:', error);
            throw error;
        })
    );    
  }
}