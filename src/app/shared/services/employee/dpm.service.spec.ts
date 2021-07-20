import { TestBed } from '@angular/core/testing';

import { DpmService } from './dpm.service';

describe('DpmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DpmService = TestBed.get(DpmService);
    expect(service).toBeTruthy();
  });
});
