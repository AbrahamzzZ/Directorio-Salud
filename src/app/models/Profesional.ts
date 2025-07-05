import { DisponibilidadProfesional } from "./disponibilidad-profesional";

export interface Profesional {
    id?: string;
    nombre: string;
    especialidad: string;
    ubicacion: string;
    fecha_Nacimiento: string;
    sexo: string;
    telefono: string;
    fotoBase64?: string;
    foto?: string;
    disponibilidad: DisponibilidadProfesional[];
    email?: string;
    password?: string;
}