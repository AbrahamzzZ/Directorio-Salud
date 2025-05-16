import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfesionalDashboardComponent } from './components/pages/profesional-dashboard/profesional-dashboard.component';
import { MantenimientoServicioComponent } from './components/pages/servicio-medico/mantenimiento-servicio/mantenimiento-servicio.component';
import { PacientesDashboardComponent } from './components/pages/pacientes-dashboard/pacientes-dashboard.component';
import { MantenimientoPacienteComponent } from './components/pages/paciente/mantenimiento-paciente/mantenimiento-paciente.component';
import { RegistroActualizacionPacienteComponent } from './components/pages/paciente/registro-actualizacion-paciente/registro-actualizacion-paciente.component';
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
import { MantenimientoResenaProfesionalComponent } from './components/pages/resena/mantenimiento-resena-profesional/mantenimiento-resena-profesional.component';
import { Autenticacion } from './guards/autenticacion.guard';
import { RolPermisos } from './guards/rol-permisos.guard';


export const routes: Routes = [
    //Rutas principales de la aplicacion
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegistrarseComponent, title: 'Formulario de registro'},
    { path: 'profesional-dashboard', component: ProfesionalDashboardComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Menú Profesional' },
    { path: 'patients-dashboard', component: PacientesDashboardComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Menú Paciente' },
    { path: 'admin-dashboard', component: AdministradorDashboardComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Menú Administrador'},

    //Rutas del modulo Profesional--Abraham Farfan
    { path: 'profesional-register', component:  RegistroActualizacionProfesionalComponent, title: 'Formulario de registro'},
    { path: 'profesional-edit/:id', component: RegistroActualizacionProfesionalComponent, canActivate: [Autenticacion]/*,canMatch: [RolPermisos]*/, title: 'Formulario de edición'},
    { path: 'profesional-list', component: MantenimientoProfesionalComponent, canActivate: [Autenticacion], title: 'Listado de profesionales'},

    //Rutas del modulo Paciente--Alejandreo Larrea
    { path: 'mis-pacientes', component: MantenimientoPacienteComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/},
    { path: 'pacientes-registro', component: RegistroActualizacionPacienteComponent},
    { path: 'editar-pacientes/:id', component: RegistroActualizacionPacienteComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/},

    //Rutas del modulo Servicio--Jose Agurto
    { path: 'my-services', component: MantenimientoServicioComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/ },
    { path: 'service-register', component: RegistroActualizacionServicioComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/ },
    { path: 'service-edit/:id', component: RegistroActualizacionServicioComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/},

    //Rutas del modulo Reseña--Angel Vivanco
    { path: 'resena-register/:profesionalId', component: RegistroActualizacionResenaComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Registrar Reseña' },
    { path: 'mantenimiento-resena', component: MantenimientoResenaComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Mis Reseñas' },
    { path: 'resena-edit/:id', component: RegistroActualizacionResenaComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Editar Reseña' },
    { path: 'ver-resenas/:profesionalId', component: MantenimientoResenaProfesionalComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Reseñas del Profesional'},
    
    //Rutas del modulo Cita--Gabriel Vera
    { path: 'mantenimiento-paciente-cita', component: MantenimientoPacienteCitaComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Paciente'},
    { path: 'registro-actualizacion-cita', component: RegistroActualizacionCitaComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Paciente'},
    { path: 'registro-actualizacion-cita/:id', component: RegistroActualizacionCitaComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Paciente' },
    { path: 'lista-servicios', component: ListaServiciosComponent, canActivate: [Autenticacion]/*, canMatch: [RolPermisos]*/, title: 'Paciente'},

    //Rutas por defecto
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];


