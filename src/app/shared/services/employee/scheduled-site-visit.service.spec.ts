import { TestBed } from '@angular/core/testing';

import { ScheduledSiteVisitService } from './scheduled-site-visit.service';

describe('ScheduledSiteVisitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduledSiteVisitService = TestBed.get(ScheduledSiteVisitService);
    expect(service).toBeTruthy();
  });
});
