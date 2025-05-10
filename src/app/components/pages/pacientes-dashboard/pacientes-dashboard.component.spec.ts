import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesDashboardComponent } from './pacientes-dashboard.component';

describe('PacientesDashboardComponent', () => {
  let component: PacientesDashboardComponent;
  let fixture: ComponentFixture<PacientesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
