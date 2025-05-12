import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfesionalDashboardComponent } from './components/pages/profesional-dashboard/profesional-dashboard.component';
import { MantenimientoServicioComponent } from './components/pages/mantenimiento-servicio/mantenimiento-servicio.component';
import { PacientesDashboardComponent } from './components/pages/pacientes-dashboard/pacientes-dashboard.component';
import { RegistroActualizacionServicioComponent } from './components/pages/registro-actualizacion-servicio/registro-actualizacion-servicio.component';

    { path: 'my-services', component: MantenimientoServicioComponent },
    { path: 'service-register', component: RegistroActualizacionServicioComponent },
    { path: 'service-edit/:id', component: RegistroActualizacionServicioComponent },
    { path: 'patients-dashboard', component: PacientesDashboardComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login'}
];


