import { TestBed } from '@angular/core/testing';

import { EmpServiceService } from './emp-service.service';

describe('EmpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpServiceService = TestBed.get(EmpServiceService);
    expect(service).toBeTruthy();
  });
});
