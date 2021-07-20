import { TestBed } from '@angular/core/testing';

import { PaymentWalletService } from './payment-wallet.service';

describe('PaymentWalletService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentWalletService = TestBed.get(PaymentWalletService);
    expect(service).toBeTruthy();
  });
});
