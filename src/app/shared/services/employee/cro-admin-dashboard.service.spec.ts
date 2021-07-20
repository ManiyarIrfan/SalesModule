import { TestBed } from '@angular/core/testing';

import { CroAdminDashboardService } from './cro-admin-dashboard.service';

describe('CroAdminDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CroAdminDashboardService = TestBed.get(CroAdminDashboardService);
    expect(service).toBeTruthy();
  });
});
