import { TestBed } from '@angular/core/testing';

import { PreSalesDashboardService } from './pre-sales-dashboard.service';

describe('PreSalesDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreSalesDashboardService = TestBed.get(PreSalesDashboardService);
    expect(service).toBeTruthy();
  });
});
