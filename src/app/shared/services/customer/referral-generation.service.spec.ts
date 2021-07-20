import { TestBed } from '@angular/core/testing';

import { ReferralGenerationService } from './referral-generation.service';

describe('ReferralGenerationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferralGenerationService = TestBed.get(ReferralGenerationService);
    expect(service).toBeTruthy();
  });
});
