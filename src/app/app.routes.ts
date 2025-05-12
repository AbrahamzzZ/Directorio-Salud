import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfesionalDashboardComponent } from './components/pages/profesional-dashboard/profesional-dashboard.component';
import { MantenimientoServicioComponent } from './components/pages/mantenimiento-servicio/mantenimiento-servicio.component';
import { PacientesDashboardComponent } from './components/pages/pacientes-dashboard/pacientes-dashboard.component';
import { RegistroActualizacionServicioComponent } from './components/pages/registro-actualizacion-servicio/registro-actualizacion-servicio.component';
import { ListaServiciosComponent } from './components/pages/lista-servicios/lista-servicios.component';
import { MantenimientoPacienteCitaComponent } from './components/pages/mantenimiento-paciente-cita/mantenimiento-paciente-cita/mantenimiento-paciente-cita.component';
import { RegistroActualizacionCitaComponent } from './components/pages/registro-actualizacion-cita/registro-actualizacion-cita/registro-actualizacion-cita.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'profesional-dashboard', component: ProfesionalDashboardComponent },
    { path: 'pacientes-dashboard', component: PacientesDashboardComponent }, 
    { path: 'registro-actualizacion-cita', component: RegistroActualizacionCitaComponent },
    { path: 'mantenimiento-paciente-cita', component: MantenimientoPacienteCitaComponent }, 
    { path: 'my-services', component: MantenimientoServicioComponent },
    { path: 'service-register', component: RegistroActualizacionServicioComponent },
    { path: 'service-edit/:id', component: RegistroActualizacionServicioComponent },
    { path: 'patients-dashboard', component: PacientesDashboardComponent },
    { path: 'lista-servicios', component: ListaServiciosComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];
