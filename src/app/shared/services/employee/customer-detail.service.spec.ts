import { TestBed } from '@angular/core/testing';

import { CustomerDetailService } from './customer-detail.service';

describe('CustomerDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerDetailService = TestBed.get(CustomerDetailService);
    expect(service).toBeTruthy();
  });
});
