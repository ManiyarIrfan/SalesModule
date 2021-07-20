import { TestBed } from '@angular/core/testing';

import { EmpAnalyticsService } from './emp-analytics.service';

describe('EmpAnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpAnalyticsService = TestBed.get(EmpAnalyticsService);
    expect(service).toBeTruthy();
  });
});
