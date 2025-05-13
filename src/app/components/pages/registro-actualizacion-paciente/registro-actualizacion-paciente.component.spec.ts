import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroActualizacionPacienteComponent } from './registro-actualizacion-paciente.component';

describe('RegistroActualizacionPacienteComponent', () => {
  let component: RegistroActualizacionPacienteComponent;
  let fixture: ComponentFixture<RegistroActualizacionPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroActualizacionPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroActualizacionPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
