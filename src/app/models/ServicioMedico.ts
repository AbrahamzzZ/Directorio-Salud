export interface ServicioMedico {
    id?: string;
    profesionalId: string;
    nombre: string;
    descripcion: string;
    precio: number;
    fechaDisponible: string;
    requiereChequeo: boolean; 
}