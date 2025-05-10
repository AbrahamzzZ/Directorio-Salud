import { TestBed } from '@angular/core/testing';

import { ServServiciosjsonService } from './serv-serviciosjson.service';

describe('ServServiciosjsonService', () => {
  let service: ServServiciosjsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServServiciosjsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
