import { TestBed } from '@angular/core/testing';

import { ReportIssueService } from './report-issue.service';

describe('ReportIssueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportIssueService = TestBed.get(ReportIssueService);
    expect(service).toBeTruthy();
  });
});
