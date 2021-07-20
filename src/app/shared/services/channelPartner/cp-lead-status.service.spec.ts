import { TestBed } from '@angular/core/testing';

import { CpLeadStatusService } from './cp-lead-status.service';

describe('CpLeadStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CpLeadStatusService = TestBed.get(CpLeadStatusService);
    expect(service).toBeTruthy();
  });
});
