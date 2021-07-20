import { TestBed } from '@angular/core/testing';

import { PaymentStatusService } from './payment-status.service';

describe('PaymentStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentStatusService = TestBed.get(PaymentStatusService);
    expect(service).toBeTruthy();
  });
});
