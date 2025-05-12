import { TestBed } from '@angular/core/testing';

import { ServCitaService } from './serv-cita.service';

describe('ServCitaService', () => {
  let service: ServCitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServCitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
