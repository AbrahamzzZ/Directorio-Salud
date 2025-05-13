import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ServicioMedico } from '../models/ServicioMedico';
import { ServLoginService } from './serv-login.service';
import { Profesional } from '../models/Profesional';

@Injectable({
  providedIn: 'root'
})
export class ServServiciosjsonService {

  profesional!: Profesional;
  private jsonUrl:string = "http://localhost:3000/servicios"; 

  constructor(private http:HttpClient, private servicioLogin:ServLoginService) { }

  getServices(): Observable<ServicioMedico[]> { 
    const id = String(this.servicioLogin.getIdentificador()); // forzamos a string
    console.log("ID Profesional:", id);
    return this.http.get<ServicioMedico[]>(`${this.jsonUrl}?profesionalId=${id}`);
  }

   getAllServices(): Observable<ServicioMedico[]> {//getAllServices para obtener todos los servi
    return this.http.get<ServicioMedico[]>(this.jsonUrl);
  }

  getServicesSearch(termino: string): Observable<ServicioMedico[]> {
    const id = String(this.servicioLogin.getIdentificador()); // mismo filtro que en getServices()
    return this.http.get<ServicioMedico[]>(`${this.jsonUrl}?profesionalId=${id}`).pipe(
      map((servicios) =>
        servicios.filter((serv) =>
          serv.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          serv.descripcion.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }
  
  getServiceById(id: string): Observable<ServicioMedico> {
    return this.http.get<ServicioMedico>(`${this.jsonUrl}/${id}`);
  }

  addService(servicio:ServicioMedico):Observable<ServicioMedico>{
    return this.http.post<ServicioMedico>(this.jsonUrl, servicio);
  }

  editService(servicio:ServicioMedico):Observable<ServicioMedico>{
    return this.http.put<ServicioMedico>(`${this.jsonUrl}/${servicio.id}`, servicio);
  }

  deleteService(servicio:ServicioMedico):Observable<void>{
    return this.http.delete<void>(`${this.jsonUrl}/${servicio.id}`);
  }
}