import { TestBed } from '@angular/core/testing';

import { EmpReportService } from './emp-report.service';

describe('EmpReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpReportService = TestBed.get(EmpReportService);
    expect(service).toBeTruthy();
  });
});
