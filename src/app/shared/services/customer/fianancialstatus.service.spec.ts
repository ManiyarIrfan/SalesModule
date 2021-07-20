import { TestBed } from '@angular/core/testing';

import { FianancialstatusService } from './fianancialstatus.service';

describe('FianancialstatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FianancialstatusService = TestBed.get(FianancialstatusService);
    expect(service).toBeTruthy();
  });
});
