import { TestBed } from '@angular/core/testing';

import { CpReportService } from './cp-report.service';

describe('CpReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CpReportService = TestBed.get(CpReportService);
    expect(service).toBeTruthy();
  });
});
