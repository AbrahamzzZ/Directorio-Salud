export interface Resena {
    id: string;
    comentario: string;
    calificacion: number;
    recomienda: boolean;
    motivoVisita: string;
    fechaResena: string;
    profesionalId?: string;
    pacienteId?: string;
}