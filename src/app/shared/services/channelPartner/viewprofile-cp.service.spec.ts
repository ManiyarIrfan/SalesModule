import { TestBed } from '@angular/core/testing';

import { ViewprofileCpService } from './viewprofile-cp.service';

describe('ViewprofileCpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewprofileCpService = TestBed.get(ViewprofileCpService);
    expect(service).toBeTruthy();
  });
});
