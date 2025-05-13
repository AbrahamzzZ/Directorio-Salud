import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfesionalDashboardComponent } from './components/pages/profesional-dashboard/profesional-dashboard.component';
import { MantenimientoServicioComponent } from './components/pages/mantenimiento-servicio/mantenimiento-servicio.component';
import { PacientesDashboardComponent } from './components/pages/pacientes-dashboard/pacientes-dashboard.component';
import { RegistroActualizacionServicioComponent } from './components/pages/registro-actualizacion-servicio/registro-actualizacion-servicio.component';
import { AdministradorDashboardComponent } from './components/pages/administrador-dashboard/administrador-dashboard.component';
import { MantenimientoProfesionalComponent } from './components/pages/profesional/mantenimiento-profesional/mantenimiento-profesional.component';
import { RegistroActualizacionProfesionalComponent } from './components/pages/profesional/registro-actualizacion-profesional/registro-actualizacion-profesional.component';
import { RegistrarseComponent } from './components/pages/registrarse/registrarse.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegistrarseComponent},
    { path: 'profesional-dashboard', component: ProfesionalDashboardComponent, title: 'Profesional' },
    { path: 'profesional-register', component:  RegistroActualizacionProfesionalComponent, title: 'Formulario de registro'},
    { path: 'profesional-edit/:id', component: RegistroActualizacionProfesionalComponent, title: 'Formulario de edición'},
    { path: 'list-profesional', component: MantenimientoProfesionalComponent, title: 'Listado de profesionales'},
    { path: 'my-services', component: MantenimientoServicioComponent },
    { path: 'service-register', component: RegistroActualizacionServicioComponent },
    { path: 'service-edit/:id', component: RegistroActualizacionServicioComponent },
    { path: 'patients-dashboard', component: PacientesDashboardComponent },
    { path: 'admin-dashboard', component: AdministradorDashboardComponent, title: 'Administrador'},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];


