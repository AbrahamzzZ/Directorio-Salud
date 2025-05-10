import { TestBed } from '@angular/core/testing';

import { ServProfesionalesService } from './serv-profesionales.service';

describe('ServProfesionalesService', () => {
  let service: ServProfesionalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServProfesionalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
