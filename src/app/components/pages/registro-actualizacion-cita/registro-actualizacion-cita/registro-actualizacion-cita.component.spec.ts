import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroActualizacionCitaComponent } from './registro-actualizacion-cita.component';

describe('RegistroActualizacionCitaComponent', () => {
  let component: RegistroActualizacionCitaComponent;
  let fixture: ComponentFixture<RegistroActualizacionCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroActualizacionCitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroActualizacionCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
