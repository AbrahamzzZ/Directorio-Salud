import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ServLoginService } from '../../../services/serv-login.service';

@Component({
  selector: 'app-pacientes-dashboard',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './pacientes-dashboard.component.html',
  styleUrl: './pacientes-dashboard.component.css'
})
export class PacientesDashboardComponent {

}
