import { TestBed } from '@angular/core/testing';

import { DpmadminService } from './dpmadmin.service';

describe('DpmadminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DpmadminService = TestBed.get(DpmadminService);
    expect(service).toBeTruthy();
  });
});
