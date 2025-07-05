import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ServicioMedico } from '../../models/ServicioMedico';
import { ServLoginService } from '.././serv-login.service';
import { Profesional } from '../../models/Profesional';

@Injectable({
  providedIn: 'root'
})
export class ServServiciosjsonService {

  profesional!: Profesional;
  private apiUrl:string = "http://localhost:5195/api/ServicioMedico"; 

  constructor(private http:HttpClient, private servicioLogin:ServLoginService) { }

  getServices(): Observable<ServicioMedico[]> { 
    const id = String(this.servicioLogin.getIdentificador()); 
    console.log("ID Profesional:", id);
    return this.http.get<ServicioMedico[]>(`${this.apiUrl}?profesionalId=${id}`);
  }

  getAllServices(): Observable<ServicioMedico[]> {
    return this.http.get<ServicioMedico[]>(this.apiUrl);
  }

  getServicesSearch(termino: string): Observable<ServicioMedico[]> {
    const id = String(this.servicioLogin.getIdentificador()); 
    return this.http.get<ServicioMedico[]>(`${this.apiUrl}?profesionalId=${id}`).pipe(
      map((servicios) =>
        servicios.filter((serv) =>
          serv.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          serv.descripcion.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }
  
  getServiceById(id: string): Observable<ServicioMedico> {
    return this.http.get<ServicioMedico>(`${this.apiUrl}/${id}`);
  }

  addService(servicio:ServicioMedico):Observable<ServicioMedico>{
    return this.http.post<ServicioMedico>(this.apiUrl, servicio);
  }

  editService(servicio:ServicioMedico):Observable<ServicioMedico>{
    return this.http.put<ServicioMedico>(`${this.apiUrl}/${servicio.id}`, servicio);
  }

  deleteService(servicio:ServicioMedico):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${servicio.id}`);
  }
}