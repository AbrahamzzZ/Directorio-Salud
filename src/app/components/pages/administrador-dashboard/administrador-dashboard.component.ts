import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-administrador-dashboard',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './administrador-dashboard.component.html',
  styleUrl: './administrador-dashboard.component.css'
})
export class AdministradorDashboardComponent {

}
