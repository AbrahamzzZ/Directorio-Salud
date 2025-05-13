import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroActualizacionResenaComponent } from './registro-actualizacion-resena.component';

describe('RegistroActualizacionResenaComponent', () => {
  let component: RegistroActualizacionResenaComponent;
  let fixture: ComponentFixture<RegistroActualizacionResenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroActualizacionResenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroActualizacionResenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
