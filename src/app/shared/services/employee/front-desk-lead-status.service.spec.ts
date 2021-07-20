import { TestBed } from '@angular/core/testing';

import { FrontDeskLeadStatusService } from './front-desk-lead-status.service';

describe('FrontDeskLeadStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrontDeskLeadStatusService = TestBed.get(FrontDeskLeadStatusService);
    expect(service).toBeTruthy();
  });
});
