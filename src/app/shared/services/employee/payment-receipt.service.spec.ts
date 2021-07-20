import { TestBed } from '@angular/core/testing';

import { PaymentReceiptService } from './payment-receipt.service';

describe('PaymentReceiptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentReceiptService = TestBed.get(PaymentReceiptService);
    expect(service).toBeTruthy();
  });
});
