import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroActualizacionServicioComponent } from './registro-actualizacion-servicio.component';

describe('RegistroActualizacionServicioComponent', () => {
  let component: RegistroActualizacionServicioComponent;
  let fixture: ComponentFixture<RegistroActualizacionServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroActualizacionServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroActualizacionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
