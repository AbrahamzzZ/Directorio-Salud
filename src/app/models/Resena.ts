export interface Resena {
    id: string;
    comentario: string;
    calificacion: number;
    recomienda: boolean;
    motivoVisita: string;
    profesionalId?: string;
    usuarioId?: string;
    pacienteId?: string;
}