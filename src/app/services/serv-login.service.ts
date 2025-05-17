import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cuenta } from '../models/Cuenta';

@Injectable({
    providedIn: 'root'
})
export class ServLoginService {
    private jsonUrl = 'http://localhost:3000/cuentas';
    rol: any = '';
    private identificador: string | undefined;

    constructor(private http: HttpClient) {
        // Recuperar el identificador si ya estaba guardado en localStorage
        this.identificador = localStorage.getItem('identificador') || undefined;
        this.rol = localStorage.getItem('rol') || '';
    }

    // Borra el rol y el identificador del usuario en el local storage
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
        return this.http.get<Cuenta[]>(this.jsonUrl).pipe(
        map((cuentas: Cuenta[]) => {
            const cuenta = cuentas.find(
            (c: Cuenta) => c.email === email && c.password === password);
            this.rol = cuenta?.rol;

            if (cuenta?.rol === 'profesional') {
            this.identificador = cuenta.profesionalId;
            } else if (cuenta?.rol === 'paciente') {
            this.identificador = cuenta.pacienteId;
            } else if (cuenta?.rol === 'administrador') {
            this.identificador = cuenta.administradorId;
            }

            localStorage.setItem('rol', this.rol);

            // Guardar en localStorage para que persista tras actualizar
            if (this.identificador) {
            localStorage.setItem('identificador', this.identificador);
            }
            return cuenta || null;
        })
        );
    } 

    // Metodo para registrar un nuevo usuario
    registrarCuenta(cuenta: Cuenta): Observable<Cuenta> {
        return this.http.post<Cuenta>(this.jsonUrl, cuenta);
    }

    // Metodo para obtener el ID del profesional asociado a la cuenta
    obtenerCuentaPorProfesionalId(profesionalId: string): Observable<Cuenta | undefined> {
        return this.http.get<Cuenta[]>(this.jsonUrl).pipe(
            map(cuentas => cuentas.find(c => c.profesionalId === profesionalId))
        );
    }

    obtenerCuentaPorPacienteId(pacienteId: string): Observable<Cuenta | undefined> {
        return this.http.get<Cuenta[]>(this.jsonUrl).pipe(
            map(cuentas => cuentas.find(c => c.pacienteId === pacienteId))
        );
    }

    // Eliminar cuenta por su ID
    eliminarCuenta(id: string): Observable<void> {
        return this.http.delete<void>(`${this.jsonUrl}/${id}`);
    }
}