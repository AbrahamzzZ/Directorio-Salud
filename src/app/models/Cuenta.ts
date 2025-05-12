export interface Cuenta {
    id: string;
    email: string;
    password: string;
    rol: string;
    profesionalId?: string;
    usuarioId?: string;
}