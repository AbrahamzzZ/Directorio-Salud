import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfesionalDashboardComponent } from './components/pages/profesional-dashboard/profesional-dashboard.component';
import { MantenimientoServicioComponent } from './components/pages/mantenimiento-servicio/mantenimiento-servicio.component';
import { PacientesDashboardComponent } from './components/pages/pacientes-dashboard/pacientes-dashboard.component';
import { RegistroActualizacionServicioComponent } from './components/pages/registro-actualizacion-servicio/registro-actualizacion-servicio.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { MantenimientoPacienteComponent } from './components/pages/mantenimiento-paciente/mantenimiento-paciente.component';
import { RegistroActualizacionPacienteComponent } from './components/pages/registro-actualizacion-paciente/registro-actualizacion-paciente.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'profesional-dashboard', component: ProfesionalDashboardComponent },
    { path: 'my-services', component: MantenimientoServicioComponent },
    { path: 'service-register', component: RegistroActualizacionServicioComponent },
    { path: 'service-edit/:id', component: RegistroActualizacionServicioComponent },
    { path: 'patients-dashboard', component: PacientesDashboardComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },//y
    { path: 'mis-pacientes', component: MantenimientoPacienteComponent},//y
    { path: 'pacientes-registro', component: RegistroActualizacionPacienteComponent},//y
    { path: 'editar-pacientes/:id', component: RegistroActualizacionPacienteComponent},//y
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];
