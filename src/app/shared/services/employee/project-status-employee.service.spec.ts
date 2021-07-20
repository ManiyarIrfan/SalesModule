import { TestBed } from '@angular/core/testing';

import { ProjectStatusEmployeeService } from './project-status-employee.service';

describe('ProjectStatusEmployeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectStatusEmployeeService = TestBed.get(ProjectStatusEmployeeService);
    expect(service).toBeTruthy();
  });
});
