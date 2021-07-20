import { TestBed } from '@angular/core/testing';

import { SalesAdminService } from './sales-admin.service';

describe('SalesAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesAdminService = TestBed.get(SalesAdminService);
    expect(service).toBeTruthy();
  });
});
