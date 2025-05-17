export interface Cita {
  id: string;
  profesionalId: string;
  pacienteId: string;
  servicioId: string;
  direccion: string;
  metodoPago: string;  
  prioridad: 'baja' | 'media' | 'alta'; 
  fechaHora: string;   
  estadoCita: 'agendada' | 'confirmada';
  esNuevoPaciente: boolean; 
}
