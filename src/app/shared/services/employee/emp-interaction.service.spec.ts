import { TestBed } from '@angular/core/testing';

import { EmpInteractionService } from './emp-interaction.service';

describe('EmpInteractionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpInteractionService = TestBed.get(EmpInteractionService);
    expect(service).toBeTruthy();
  });
});
