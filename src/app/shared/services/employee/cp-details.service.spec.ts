import { TestBed } from '@angular/core/testing';

import { CpDetailsService } from './cp-details.service';

describe('CpDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CpDetailsService = TestBed.get(CpDetailsService);
    expect(service).toBeTruthy();
  });
});
