import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../../models/Paciente';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Cuenta } from '../../models/Cuenta';

@Injectable({
  providedIn: 'root'
})
export class ServPacientesService {
  private apiUrl = 'http://localhost:5195/api/Pacientes';
  private cuentaApiUrl = 'http://localhost:5195/api/Cuenta';

  constructor(private http: HttpClient) {}

  getpacientes(): Observable<Paciente[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(pacientes => pacientes.map(p => this.mapPacienteFromApi(p))),
      catchError(this.handleError)
    );
  }

  getpacientesSearch(nombre: string): Observable<Paciente[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Search?nombre=${nombre}`).pipe(
      map(pacientes => pacientes.map(p => this.mapPacienteFromApi(p))),
      catchError(this.handleError)
    );
  }

  getPacientePorId(id: string): Observable<Paciente> {
    return this.http.get<any>(`${this.apiUrl}/${parseInt(id)}`).pipe(
      map(p => this.mapPacienteFromApi(p)),
      catchError(this.handleError)
    );
  }

  addPatient(paciente: Paciente, cuenta: Cuenta): Observable<any> {
    const payload = {
      Paciente: {
        Nombre: paciente.nombre,
        Telefono: paciente.telefono,
        Edad: paciente.edad,
        Contacto: paciente.contacto,
        TipoSangre: paciente.tipoSangre,
        Estado: paciente.estado,
        FechaRegistro: paciente.fechaRegistro
      },
      Cuenta: {
        Email: cuenta.email,
        Password: cuenta.password,
        Rol: cuenta.rol
      }
    };

    return this.http.post<any>(`${this.apiUrl}/RegistrarPacienteConCuenta`, payload).pipe(
    map(response => {      
      return {
        mensaje: response.mensaje,
        pacienteId: response.pacienteId
      };
    }),
    catchError(this.handleError)
  );
  }

  editPatient(paciente: Paciente): Observable<any> {
    const idNumber = parseInt(paciente.id!);
    const pacientePayload = {
      Id: idNumber,
      Nombre: paciente.nombre,
      Telefono: paciente.telefono,
      Edad: paciente.edad,
      Contacto: paciente.contacto,
      TipoSangre: paciente.tipoSangre,
      Estado: paciente.estado,
      FechaRegistro: paciente.fechaRegistro
    };

    return this.http.put<any>(`${this.apiUrl}/${idNumber}`, pacientePayload).pipe(
    map(response => {     
      return response;
    }),
    catchError(this.handleError)
  );
  }

  deletePatient(paciente: Paciente): Observable<void> {
    const idNumber = parseInt(paciente.id!);
    return this.http.delete<void>(`${this.apiUrl}/${idNumber}`).pipe(
      catchError(this.handleError)
    );
  }
  private mapPacienteFromApi(p: any): Paciente {
    return {
      id: p.Id ? p.Id.toString() : p.id?.toString(),
      nombre: p.Nombre || p.nombre,
      telefono: p.Telefono || p.telefono,
      edad: p.Edad || p.edad,
      contacto: p.Contacto || p.contacto,
      tipoSangre: p.TipoSangre || p.tipoSangre,
      fechaRegistro: p.FechaRegistro || p.fechaRegistro,
      estado: p.Estado !== undefined ? p.Estado : p.estado
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en servicio:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {      
      errorMessage = `Error: ${error.error.message}`;
    } else {     
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar al servidor. Verifique su conexion.';
      } else if (error.status === 404) {
        errorMessage = 'El recurso solicitado no fue encontrado.';
      } else if (error.status === 400) {
        errorMessage = error.error?.mensaje || error.error?.message || 'Datos invalidos.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor.';
      } else {
        errorMessage = error.error?.mensaje || error.error?.message || `Error: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}