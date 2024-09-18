import { TestBed } from '@angular/core/testing';

import { WebsocetService } from './websocet.service';

describe('WebsocetService', () => {
  let service: WebsocetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
