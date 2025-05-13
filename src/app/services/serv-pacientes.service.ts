import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/Paciente';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServPacientesService {

   private jsonUrl = 'http://localhost:3000/pacientes';

  constructor(private http: HttpClient) {}
 
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
     const urlDelPaciente =`${this.jsonUrl}/${paciente.id}`;
     return this.http.delete<void>(urlDelPaciente);      
   }

}
