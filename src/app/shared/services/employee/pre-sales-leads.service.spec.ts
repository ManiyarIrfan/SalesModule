import { TestBed } from '@angular/core/testing';

import { PreSalesLeadsService } from './pre-sales-leads.service';

describe('PreSalesLeadsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreSalesLeadsService = TestBed.get(PreSalesLeadsService);
    expect(service).toBeTruthy();
  });
});
