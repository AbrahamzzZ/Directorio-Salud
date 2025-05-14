import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Paciente } from '../../../models/Paciente';
import { ServPacientesService } from '../../../services/serv-pacientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mantenimiento-paciente',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, DatePipe],
  templateUrl: './mantenimiento-paciente.component.html',
  styleUrl: './mantenimiento-paciente.component.css'
})
export class MantenimientoPacienteComponent {
  constructor(private servicePacientes:ServPacientesService, private router:Router){}

  displayedColumns: string[] = ['nombre', 'correo', 'telefono', 'Edad', 'diagnostico', 'tipoSangre', 'fechaRegistro', 'estado', 'actions'];
  dataSource = new MatTableDataSource<Paciente>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes():void{
    this.servicePacientes.getpacientes().subscribe((datos:Paciente[])=>{
      this.dataSource.data = datos;
    })
  }

  search(searchInput: HTMLInputElement) {
    const texto = searchInput.value.trim();
    if (texto) {
      this.servicePacientes.getpacientesSearch(texto).subscribe((datos: Paciente[]) => {
        this.dataSource.data = datos;
      });
    } else {
      this.cargarPacientes();
    }
  }

  editar(paciente: Paciente) {
   this.router.navigate(['editar-pacientes', paciente.id]);
  }

  eliminar(paciente: Paciente) {
    const confirmar = confirm("Estas seguro de eliminar al paciente "+paciente.nombre+"?");
    if(confirmar){
      this.servicePacientes.deletePatient(paciente).subscribe(()=>{
        alert("Paciente eliminado exitosamente");
        this.cargarPacientes(); 
      })
    }
  }

}
