import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tabla-reutilizable',
  
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
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
      case 'fechaRegistro':
        return 'Fecha de Registro';
      case 'tipoSangre':
        return 'Tipo de Sangre';      
      default:
        return col.charAt(0).toUpperCase() + col.slice(1); // Capitaliza
    }
  }
}
