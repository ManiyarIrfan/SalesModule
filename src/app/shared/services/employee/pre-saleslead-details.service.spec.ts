import { TestBed } from '@angular/core/testing';

import { PreSalesleadDetailsService } from './pre-saleslead-details.service';

describe('PreSalesleadDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreSalesleadDetailsService = TestBed.get(PreSalesleadDetailsService);
    expect(service).toBeTruthy();
  });
});
