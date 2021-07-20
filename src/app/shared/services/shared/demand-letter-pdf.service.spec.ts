import { TestBed } from '@angular/core/testing';

import { DemandLetterPdfService } from './demand-letter-pdf.service';

describe('DemandLetterPdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemandLetterPdfService = TestBed.get(DemandLetterPdfService);
    expect(service).toBeTruthy();
  });
});
