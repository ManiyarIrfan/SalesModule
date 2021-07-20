import { TestBed } from '@angular/core/testing';

import { NewProjectsService } from './new-projects.service';

describe('NewProjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewProjectsService = TestBed.get(NewProjectsService);
    expect(service).toBeTruthy();
  });
});
