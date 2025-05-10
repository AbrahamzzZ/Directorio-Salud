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

    getIdentificador() {
        return this.identificador;
    }

    validarCredenciales(email: string, password: string): Observable<Cuenta | null> {
        return this.http.get<Cuenta[]>(this.jsonUrl).pipe(
        map((cuentas: Cuenta[]) => {
            const cuenta = cuentas.find(
            (c: Cuenta) => c.email === email && c.password === password
            );
            this.rol = cuenta?.rol;
            this.identificador = cuenta?.profesionalId;
            localStorage.setItem('rol', this.rol);

            // Guardar en localStorage para que persista tras actualizar
            if (this.identificador) {
                localStorage.setItem('identificador', this.identificador);
            }

            return cuenta || null;
        })
        );
    } 
}

