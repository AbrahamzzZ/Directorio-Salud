export interface Cita {
  id: string;
  profesionalId: string;
  usuarioId: string;
  servicioId: string;
  direccion: string;
  metodoPago: string;  
  prioridad: 'baja' | 'media' | 'alta'; 
  fechaHora: string;   
  estado: 'agendada' | 'confirmada'; 
}
