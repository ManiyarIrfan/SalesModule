import { TestBed } from '@angular/core/testing';

import { MystatementService } from './mystatement.service';

describe('MystatementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MystatementService = TestBed.get(MystatementService);
    expect(service).toBeTruthy();
  });
});
