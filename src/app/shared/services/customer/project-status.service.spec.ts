import { TestBed } from '@angular/core/testing';

import { ProjectStatusService } from './project-status.service';

describe('ProjectStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectStatusService = TestBed.get(ProjectStatusService);
    expect(service).toBeTruthy();
  });
});
