import { TestBed } from '@angular/core/testing';

import { ReferralDashboardService } from './referral-dashboard.service';

describe('ReferralDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferralDashboardService = TestBed.get(ReferralDashboardService);
    expect(service).toBeTruthy();
  });
});
