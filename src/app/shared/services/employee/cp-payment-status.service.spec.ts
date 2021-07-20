import { TestBed } from '@angular/core/testing';

import { CpPaymentStatusService } from './cp-payment-status.service';

describe('CpPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CpPaymentStatusService = TestBed.get(CpPaymentStatusService);
    expect(service).toBeTruthy();
  });
});
