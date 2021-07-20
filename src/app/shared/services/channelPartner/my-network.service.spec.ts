import { TestBed } from '@angular/core/testing';

import { MyNetworkService } from './my-network.service';

describe('MyNetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyNetworkService = TestBed.get(MyNetworkService);
    expect(service).toBeTruthy();
  });
});
