import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPacienteCitaComponent } from './mantenimiento-paciente-cita.component';

describe('MantenimientoPacienteCitaComponent', () => {
  let component: MantenimientoPacienteCitaComponent;
  let fixture: ComponentFixture<MantenimientoPacienteCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoPacienteCitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoPacienteCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
