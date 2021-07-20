import { TestBed } from '@angular/core/testing';

import { SalesLeadDetailsService } from './sales-lead-details.service';

describe('SalesLeadDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesLeadDetailsService = TestBed.get(SalesLeadDetailsService);
    expect(service).toBeTruthy();
  });
});
