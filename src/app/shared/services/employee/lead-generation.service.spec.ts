import { TestBed } from '@angular/core/testing';

import { LeadGenerationService } from './lead-generation.service';

describe('LeadGenerationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeadGenerationService = TestBed.get(LeadGenerationService);
    expect(service).toBeTruthy();
  });
});
