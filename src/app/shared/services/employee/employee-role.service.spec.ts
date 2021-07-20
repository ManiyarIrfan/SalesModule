import { TestBed } from '@angular/core/testing';

import { EmployeeRoleService } from './employee-role.service';

describe('EmployeeRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeeRoleService = TestBed.get(EmployeeRoleService);
    expect(service).toBeTruthy();
  });
});
