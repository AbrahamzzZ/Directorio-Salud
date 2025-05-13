import { TestBed } from '@angular/core/testing';

import { ServResenasService } from './serv-resenas.service';

describe('ServResenasService', () => {
  let service: ServResenasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServResenasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
