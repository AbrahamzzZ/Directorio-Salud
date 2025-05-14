import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfesionalDashboardComponent } from './components/pages/profesional-dashboard/profesional-dashboard.component';
import { MantenimientoServicioComponent } from './components/pages/servicio-medico/mantenimiento-servicio/mantenimiento-servicio.component';
import { PacientesDashboardComponent } from './components/pages/pacientes-dashboard/pacientes-dashboard.component';
import { MantenimientoPacienteComponent } from './components/pages/mantenimiento-paciente/mantenimiento-paciente.component';
import { RegistroActualizacionPacienteComponent } from './components/pages/registro-actualizacion-paciente/registro-actualizacion-paciente.component';

import { RegistroActualizacionServicioComponent } from './components/pages/servicio-medico/registro-actualizacion-servicio/registro-actualizacion-servicio.component';
import { RegistrarseComponent } from './components/pages/registrarse/registrarse.component';
import { RegistroActualizacionProfesionalComponent } from './components/pages/profesional/registro-actualizacion-profesional/registro-actualizacion-profesional.component';
import { MantenimientoProfesionalComponent } from './components/pages/profesional/mantenimiento-profesional/mantenimiento-profesional.component';
import { AdministradorDashboardComponent } from './components/pages/administrador-dashboard/administrador-dashboard.component';


import { RegistroActualizacionResenaComponent } from './components/pages/resena/registro-actualizacion-resena/registro-actualizacion-resena.component';
import { MantenimientoResenaComponent } from './components/pages/resena/mantenimiento-resena/mantenimiento-resena.component';
import { MantenimientoPacienteCitaComponent } from './components/pages/cita/mantenimiento-paciente-cita/mantenimiento-paciente-cita.component';
import { RegistroActualizacionCitaComponent } from './components/pages/cita/registro-actualizacion-cita/registro-actualizacion-cita.component';
import { ListaServiciosComponent } from './components/pages/cita/lista-servicios/lista-servicios.component';



export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegistrarseComponent, title: 'Formulario de registro'},
    { path: 'profesional-dashboard', component: ProfesionalDashboardComponent, title: 'Profesional' },
    { path: 'profesional-register', component:  RegistroActualizacionProfesionalComponent, title: 'Formulario de registro'},
    { path: 'profesional-edit/:id', component: RegistroActualizacionProfesionalComponent, title: 'Formulario de edición'},
    { path: 'list-profesional', component: MantenimientoProfesionalComponent, title: 'Listado de profesionales'},
    { path: 'my-services', component: MantenimientoServicioComponent },
    { path: 'service-register', component: RegistroActualizacionServicioComponent },
    { path: 'service-edit/:id', component: RegistroActualizacionServicioComponent },
    { path: 'patients-dashboard', component: PacientesDashboardComponent },
    { path: 'mis-pacientes', component: MantenimientoPacienteComponent},//y
    { path: 'pacientes-registro', component: RegistroActualizacionPacienteComponent},//y
    { path: 'editar-pacientes/:id', component: RegistroActualizacionPacienteComponent},//y
    { path: 'admin-dashboard', component: AdministradorDashboardComponent, title: 'Administrador'},
    { path: 'resena-register/:profesionalId', component: RegistroActualizacionResenaComponent, title: 'Registrar Reseña' },
    { path: 'mantenimiento-resena', component: MantenimientoResenaComponent, title: 'Mis Reseñas' },
    { path: 'resena-edit/:id', component: RegistroActualizacionResenaComponent, title: 'Editar Reseña' },
    {path: 'mantenimiento-paciente-cita', component: MantenimientoPacienteCitaComponent, title: 'Paciente'},
    {path: 'registro-actualizacion-cita', component: RegistroActualizacionCitaComponent, title: 'Paciente'},
    { path: 'registro-actualizacion-cita/:id', component: RegistroActualizacionCitaComponent, title: 'Paciente' },
    {path: 'lista-servicios', component: ListaServiciosComponent, title: 'Paciente'},
    {path: 'pacientes-dashboard', component: PacientesDashboardComponent, title: 'Home Paciente'},

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];


