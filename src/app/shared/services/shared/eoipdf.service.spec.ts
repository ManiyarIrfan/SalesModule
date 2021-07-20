import { TestBed } from '@angular/core/testing';

import { EoipdfService } from './eoipdf.service';

describe('EoipdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EoipdfService = TestBed.get(EoipdfService);
    expect(service).toBeTruthy();
  });
});
