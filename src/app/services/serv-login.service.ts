import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cuenta } from '../models/Cuenta';

@Injectable({
    providedIn: 'root'
})
export class ServLoginService {
    private apiUrl = 'http://localhost:5195/api/Cuenta';
    rol: any = '';
    private identificador: string | undefined;

    constructor(private http: HttpClient) {
        this.identificador = localStorage.getItem('identificador') || undefined;
        this.rol = localStorage.getItem('rol') || '';
    }

    cerrarSesion() {
        localStorage.removeItem('identificador');
        localStorage.removeItem('rol');
        this.identificador = undefined;
        this.rol = '';
    }

    getIdentificador() {
        return this.identificador;
    }

    validarCredenciales(email: string, password: string): Observable<Cuenta | null> {
        return this.http.post<Cuenta>(`${this.apiUrl}/login`, { email, password }).pipe(
        map((cuenta: Cuenta) => {
            this.rol = cuenta?.rol;

            if (cuenta?.rol === 'profesional') {
            this.identificador = cuenta.profesionalId;
            } else if (cuenta?.rol === 'paciente') {
            this.identificador = cuenta.pacienteId;
            } else if (cuenta?.rol === 'administrador') {
            this.identificador = cuenta.administradorId;
            }

            localStorage.setItem('rol', this.rol);
            if (this.identificador) {
            localStorage.setItem('identificador', this.identificador);
            }

            return cuenta || null;
        })
        );
    } 

    registrarCuenta(cuenta: Cuenta): Observable<Cuenta> {
        return this.http.post<Cuenta>(`${this.apiUrl}/RegistrarCuenta`, cuenta);
    }

    obtenerCuentaPorProfesionalId(profesionalId: string): Observable<Cuenta | undefined> {
        return this.http.get<Cuenta[]>(this.apiUrl).pipe(
            map(cuentas => cuentas.find(c => c.profesionalId === profesionalId))
        );
    }

    obtenerCuentaPorPacienteId(pacienteId: string): Observable<Cuenta | undefined> {
        return this.http.get<Cuenta[]>(this.apiUrl).pipe(
            map(cuentas => cuentas.find(c => c.pacienteId === pacienteId))
        );
    }

    eliminarCuenta(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}