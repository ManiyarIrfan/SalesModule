import { TestBed } from '@angular/core/testing';

import { IdeathonService } from './ideathon.service';

describe('IdeathonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdeathonService = TestBed.get(IdeathonService);
    expect(service).toBeTruthy();
  });
});
