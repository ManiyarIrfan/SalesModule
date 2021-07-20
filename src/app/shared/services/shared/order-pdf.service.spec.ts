import { TestBed } from '@angular/core/testing';

import { OrderPdfService } from './order-pdf.service';

describe('OrderPdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderPdfService = TestBed.get(OrderPdfService);
    expect(service).toBeTruthy();
  });
});
