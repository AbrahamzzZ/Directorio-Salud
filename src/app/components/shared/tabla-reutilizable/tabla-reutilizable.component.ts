import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormatearFechaDisponibilidadPipe } from '../../../pipes/formatear-fecha-disponibilidad.pipe';

@Component({
  selector: 'app-tabla-reutilizable',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, FormatearFechaDisponibilidadPipe],
  templateUrl: './tabla-reutilizable.component.html',
  styleUrl: './tabla-reutilizable.component.css'
})
export class TablaReutilizableComponent<T> implements AfterViewInit {
  @Input() columnas: string[] = [];

  private _data: T[] = [];
  @Input() set data(value: T[]) {
    this._data = value;
    this.dataSource.data = value;
  }

  @Input() acciones: { tipo: string; icono: string; tooltip: string }[] = [];

  @Output() accion = new EventEmitter<{ tipo: string, fila: T }>();

  columnasSignal = signal(this.columnas);
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTituloCabecera(col: string): string {
    switch (col) {
      case 'fechaDisponible':
        return 'Fecha Disponible';
      case 'requiereChequeo':
        return 'Requiere Chequeo';      
      case  'fechaRegistro':
        return 'Fecha de Registro'
      case  'tipoSangre':
        return 'Tipo de Sangre' 
      case 'estado':
        return 'Activo' 
      case 'metodoPago':
        return 'Metodo de Pago'
      case 'fechaHora':
        return 'Fecha de Registro' 
      case 'estadoCita':
        return 'Estado'
      case 'nombreProfesional':
        return 'Profesional';
      case 'nombrePaciente':
        return 'Paciente';        
      case 'motivoVisita':
        return 'Motivo de Visita';
      case 'calificacion':
        return 'Calificación';
      case 'fechaResena':
        return 'Fecha';
      case 'recomienda':
      return '¿Recomienda?';        
      default: 
        return col.charAt(0).toUpperCase() + col.slice(1); 
    }
  }
}
