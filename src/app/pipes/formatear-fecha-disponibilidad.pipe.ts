import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearFechaDisponibilidad'
})
export class FormatearFechaDisponibilidadPipe implements PipeTransform {
  
  transform(value: string[] | string): string {
    if (!value) return '';

    const formatear = (fechaStr: string): string => {
      const fecha = new Date(fechaStr);

      const pad = (n: number) => n.toString().padStart(2, '0');

      const año = fecha.getFullYear();
      const mes = pad(fecha.getMonth() + 1);
      const dia = pad(fecha.getDate());
      const hora = pad(fecha.getHours());
      const minuto = pad(fecha.getMinutes());

      return `${año}/${mes}/${dia} ${hora}:${minuto}`;
    };

    if (Array.isArray(value)) {
      return value.map(formatear).join('\n');
    } else {
      return formatear(value);
    }
  }
}
