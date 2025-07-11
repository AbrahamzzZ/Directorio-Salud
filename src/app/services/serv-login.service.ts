import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cuenta } from '../models/Cuenta';
import {jwtDecode} from 'jwt-decode';

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
        localStorage.removeItem('token');
        localStorage.removeItem('identificador');
        localStorage.removeItem('rol');
        this.identificador = undefined;
        this.rol = '';
    }

    getIdentificador() {
        return this.identificador;
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
        } catch (error) {
        return false;
        }
    }
    
    getTokenExpiration(): number | null {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
        const decoded: any = jwtDecode(token);
        return decoded.exp * 1000; 
        } catch (error) {
        return null;
        }
    }

    isTokenExpiringSoon(minutesBefore: number = 5): boolean {
        const expiration = this.getTokenExpiration();
        if (!expiration) return true;
        
        const timeBeforeExpiration = minutesBefore * 60 * 1000;
        return Date.now() > (expiration - timeBeforeExpiration);
    }

    validarCredenciales(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            map((resp) => {
            const token = resp.token;
            if (token) {
                localStorage.setItem('token', token);

                const decoded: any = jwtDecode(token); 
                this.rol = decoded.rol;
                if (decoded.rol === 'paciente' && decoded.pacienteId) {
                    this.identificador = decoded.pacienteId;
                } else if (decoded.rol === 'profesional' && decoded.profesionalId) {
                    this.identificador = decoded.profesionalId;
                } else if (decoded.rol === 'administrador' && decoded.administradorId) {
                    this.identificador = decoded.administradorId;
                } else {
                    this.identificador = decoded.id;
                }

                localStorage.setItem('rol', this.rol);
                if (this.identificador !== undefined) {
                localStorage.setItem('identificador', this.identificador);
                }

                return decoded;
            }

            return null;
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