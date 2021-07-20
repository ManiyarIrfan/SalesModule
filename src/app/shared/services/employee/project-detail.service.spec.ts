import { TestBed } from '@angular/core/testing';

import { ProjectDetailService } from './project-detail.service';

describe('ProjectDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectDetailService = TestBed.get(ProjectDetailService);
    expect(service).toBeTruthy();
  });
});
