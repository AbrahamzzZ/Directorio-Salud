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
import { MantenimientoResenaAdministradorComponent } from './components/pages/resena/mantenimiento-resena-administrador/mantenimiento-resena-administrador.component';
import { MantenimientoVerResenaProfesionalComponent } from './components/pages/resena/mantenimiento-ver-resena-profesional/mantenimiento-ver-resena-profesional.component';
import { VistaProfesionalesComponent } from './components/pages/profesional/vista-profesionales/vista-profesionales.component';
import { AuthGuard } from './guards/auth.guard';



export const routes: Routes = [
    //Rutas principales de la aplicacion
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegistrarseComponent, title: 'Formulario de registro'},
    { path: 'profesional-dashboard', canActivate: [AuthGuard], component: ProfesionalDashboardComponent, title: 'Menú Profesional' },
    { path: 'patients-dashboard', canActivate: [AuthGuard], component: PacientesDashboardComponent, title: 'Menú Paciente' },
    { path: 'admin-dashboard', canActivate: [AuthGuard], component: AdministradorDashboardComponent, title: 'Menú Administrador'},

    //Rutas del modulo Profesional--Abraham Farfan
    { path: 'profesional-register', component:  RegistroActualizacionProfesionalComponent, title: 'Formulario de registro'},
    { path: 'profesional-edit/:id', canActivate: [AuthGuard], component: RegistroActualizacionProfesionalComponent, title: 'Formulario de edición'},
    { path: 'profesional-list', canActivate: [AuthGuard], component: MantenimientoProfesionalComponent, title: 'Listado de profesionales'},
    { path: 'vista-profesionales', component: VistaProfesionalesComponent, title: 'Profesionales' },

    //Rutas del modulo Paciente--Alejandreo Larrea
    { path: 'mis-pacientes', canActivate: [AuthGuard], component: MantenimientoPacienteComponent},
    { path: 'pacientes-registro', component: RegistroActualizacionPacienteComponent},
    { path: 'editar-pacientes/:id', canActivate: [AuthGuard], component: RegistroActualizacionPacienteComponent},

    //Rutas del modulo Servicio--Jose Agurto
    { path: 'my-services', canActivate: [AuthGuard], component: MantenimientoServicioComponent},
    { path: 'service-register', canActivate: [AuthGuard], component: RegistroActualizacionServicioComponent},
    { path: 'service-edit/:id', canActivate: [AuthGuard], component: RegistroActualizacionServicioComponent},

    //Rutas del modulo Reseña--Angel Vivanco
    { path: 'resena-register/:profesionalId', canActivate: [AuthGuard], component: RegistroActualizacionResenaComponent, title: 'Registrar Reseña' },
    { path: 'mantenimiento-resena', canActivate: [AuthGuard], component: MantenimientoResenaComponent, title: 'Mis Reseñas' },
    { path: 'resena-edit/:id', canActivate: [AuthGuard], component: RegistroActualizacionResenaComponent, title: 'Editar Reseña' },
    { path: 'ver-resenas/:profesionalId', canActivate: [AuthGuard], component: MantenimientoResenaProfesionalComponent, title: 'Reseñas del Profesional'},
    { path: 'admin-resenas', canActivate: [AuthGuard], component: MantenimientoResenaAdministradorComponent, title: 'Reseñas del Administrador'},
    { path: 'mis-resenas-profesional', canActivate: [AuthGuard], component: MantenimientoVerResenaProfesionalComponent, title: 'Mis Reseñas Profesionales' },

    //Rutas del modulo Cita--Gabriel Vera
    { path: 'mantenimiento-paciente-cita', canActivate: [AuthGuard], component: MantenimientoPacienteCitaComponent, title: 'Paciente'},
    { path: 'registro-actualizacion-cita', canActivate: [AuthGuard], component: RegistroActualizacionCitaComponent,title: 'Paciente'},
    { path: 'registro-actualizacion-cita/:id', canActivate: [AuthGuard], component: RegistroActualizacionCitaComponent,  title: 'Paciente' },
    { path: 'lista-servicios', canActivate: [AuthGuard], component: ListaServiciosComponent, title: 'Paciente'},

    //Rutas por defecto
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];