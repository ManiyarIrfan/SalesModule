import { TestBed } from '@angular/core/testing';

import { ReceiptPdfService } from './receipt-pdf.service';

describe('ReceiptPdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceiptPdfService = TestBed.get(ReceiptPdfService);
    expect(service).toBeTruthy();
  });
});
