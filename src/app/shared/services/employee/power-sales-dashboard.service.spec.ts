import { TestBed } from '@angular/core/testing';

import { PowerSalesDashboardService } from './power-sales-dashboard.service';

describe('PowerSalesDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PowerSalesDashboardService = TestBed.get(PowerSalesDashboardService);
    expect(service).toBeTruthy();
  });
});
