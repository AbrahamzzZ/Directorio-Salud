import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoServicioComponent } from './mantenimiento-servicio.component';

describe('MantenimientoServicioComponent', () => {
  let component: MantenimientoServicioComponent;
  let fixture: ComponentFixture<MantenimientoServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
