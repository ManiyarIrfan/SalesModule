import { TestBed } from '@angular/core/testing';

import { IssueTrackService } from './issue-track.service';

describe('IssueTrackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueTrackService = TestBed.get(IssueTrackService);
    expect(service).toBeTruthy();
  });
});
