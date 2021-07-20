import { TestBed } from '@angular/core/testing';

import { ReferralStatusService } from './referral-status.service';

describe('ReferralStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferralStatusService = TestBed.get(ReferralStatusService);
    expect(service).toBeTruthy();
  });
});
