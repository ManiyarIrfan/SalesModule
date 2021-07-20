import { TestBed } from '@angular/core/testing';

import { PaymentScheduleService } from './payment-schedule.service';

describe('PaymentScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentScheduleService = TestBed.get(PaymentScheduleService);
    expect(service).toBeTruthy();
  });
});
