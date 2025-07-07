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
import { RolGuard } from './guards/rol.guard';
import { AccesoDenegadoComponent } from './components/pages/acceso-denegado/acceso-denegado.component';



export const routes: Routes = [

    //Rutas de Inicio de sesión
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'registrar', component: RegistrarseComponent, title: 'Formulario de registro'},

    //Rutas principales de la aplicacion
    { path: 'profesional-dashboard', canActivate: [AuthGuard, RolGuard], data: { roles: ['profesional'] }, component: ProfesionalDashboardComponent, title: 'Menú Profesional' },
    { path: 'patients-dashboard', canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: PacientesDashboardComponent, title: 'Menú Paciente' },
    { path: 'admin-dashboard', canActivate: [AuthGuard, RolGuard], data: { roles: ['administrador'] }, component: AdministradorDashboardComponent, title: 'Menú Administrador'},

    //Rutas del modulo Profesional--Abraham Farfan
    { path: 'profesional-register', component:  RegistroActualizacionProfesionalComponent, title: 'Formulario de registro'},
    { path: 'profesional-edit/:id', canActivate: [AuthGuard, RolGuard], data: { roles: ['profesional'] }, component: RegistroActualizacionProfesionalComponent, title: 'Formulario de edición'},
    { path: 'profesional-list', canActivate: [AuthGuard, RolGuard], data: { roles: ['administrador'] }, component: MantenimientoProfesionalComponent, title: 'Listado de profesionales'},
    { path: 'vista-profesionales', canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: VistaProfesionalesComponent, title: 'Profesionales' },

    //Rutas del modulo Paciente--Alejandreo Larrea
    { path: 'mis-pacientes', canActivate: [AuthGuard, RolGuard], data: { roles: ['administrador'] }, component: MantenimientoPacienteComponent},
    { path: 'pacientes-registro', component: RegistroActualizacionPacienteComponent},
    { path: 'editar-pacientes/:id', canActivate: [AuthGuard, RolGuard], data: { roles: ['administrador'] }, component: RegistroActualizacionPacienteComponent},

    //Rutas del modulo Servicio--Jose Agurto
    { path: 'my-services', canActivate: [AuthGuard, RolGuard], data: { roles: ['profesional'] }, component: MantenimientoServicioComponent},
    { path: 'service-register', canActivate: [AuthGuard, RolGuard], data: { roles: ['profesional'] }, component: RegistroActualizacionServicioComponent},
    { path: 'service-edit/:id', canActivate: [AuthGuard, RolGuard], data: { roles: ['profesional'] }, component: RegistroActualizacionServicioComponent},

    //Rutas del modulo Reseña--Angel Vivanco
    { path: 'resena-register/:profesionalId', canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: RegistroActualizacionResenaComponent, title: 'Registrar Reseña' },
    { path: 'mantenimiento-resena', canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: MantenimientoResenaComponent, title: 'Mis Reseñas' },
    { path: 'resena-edit/:id', canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: RegistroActualizacionResenaComponent, title: 'Editar Reseña' },
    { path: 'ver-resenas/:profesionalId', canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: MantenimientoResenaProfesionalComponent, title: 'Reseñas del Profesional'},
    { path: 'admin-resenas', canActivate: [AuthGuard, RolGuard], data: { roles: ['administrador'] }, component: MantenimientoResenaAdministradorComponent, title: 'Reseñas del Administrador'},
    { path: 'mis-resenas-profesional', canActivate: [AuthGuard, RolGuard], data: { roles: ['profesional'] }, component: MantenimientoVerResenaProfesionalComponent, title: 'Mis Reseñas Profesionales' },

    //Rutas del modulo Cita--Gabriel Vera
    { path: 'mantenimiento-paciente-cita', canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: MantenimientoPacienteCitaComponent, title: 'Paciente'},
    { path: 'registro-actualizacion-cita', canActivate: [AuthGuard], component: RegistroActualizacionCitaComponent,title: 'Paciente'},
    { path: 'registro-actualizacion-cita/:id', canActivate: [AuthGuard], component: RegistroActualizacionCitaComponent,  title: 'Paciente' },
    { path: 'lista-servicios',canActivate: [AuthGuard, RolGuard], data: { roles: ['paciente'] }, component: ListaServiciosComponent, title: 'Paciente'},

    //Ruta sin permisos
    { path: 'acceso-denegado', component: AccesoDenegadoComponent, title: 'Acceso denegado' },

    //Rutas por defecto
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];