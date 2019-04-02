import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket-serivce.service';

describe('SocketSerivceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});
