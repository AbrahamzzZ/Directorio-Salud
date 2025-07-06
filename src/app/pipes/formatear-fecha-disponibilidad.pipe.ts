import { Pipe, PipeTransform } from '@angular/core';
import { DisponibilidadProfesional } from '../models/Disponibilidad-profesional';

@Pipe({
  name: 'formatearFechaDisponibilidad'
})
export class FormatearFechaDisponibilidadPipe implements PipeTransform {
  
  transform(disponibilidad: DisponibilidadProfesional[]): string {
    if (!disponibilidad || disponibilidad.length === 0) return 'Sin disponibilidad';

    return disponibilidad.map(d => {
      const fecha = new Date(`${d.fecha}T${d.horaInicio}`);
      const fin = new Date(`${d.fecha}T${d.horaFin}`);
      const fechaStr = fecha.toLocaleDateString('es-EC');
      const horaInicioStr = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const horaFinStr = fin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return `${fechaStr} ${horaInicioStr} - ${horaFinStr}`;
    }).join(', ');
  }
}
