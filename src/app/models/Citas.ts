export interface Cita {
  id: string;
  profesionalId: string;
  pacienteId: string;
  servicioId: string;
  direccion: string;
  metodoPago: string;  
  prioridad: 'baja' | 'media' | 'alta'; 
  fechaHora: string;   
  estado: 'agendada' | 'confirmada'; 
}
