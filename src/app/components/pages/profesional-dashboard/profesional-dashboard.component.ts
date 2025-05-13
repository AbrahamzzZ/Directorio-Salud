import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ServLoginService } from '../../../services/serv-login.service';
import { ServProfesionalesService } from '../../../services/serv-profesionales.service';
import { Profesional } from '../../../models/Profesional';

@Component({
  selector: 'app-profesional-dashboard',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './profesional-dashboard.component.html',
  styleUrl: './profesional-dashboard.component.css'
})
export class ProfesionalDashboardComponent implements OnInit {

  profesional!: Profesional;
  constructor(private servicioLogin:ServLoginService, private profesionalesService: ServProfesionalesService){
    //console.log("El identificador de la persona profesional es: "+servicioLogin.getIdentificador());
  }
  ngOnInit() {
      const id = this.servicioLogin.getIdentificador();
      if (id) {
        this.profesionalesService.getProfesionalPorId(id).subscribe((data) => {
          if (data) {
            this.profesional = data;
          }
        });
      }
  }

}
