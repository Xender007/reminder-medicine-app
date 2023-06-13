import { TestBed } from '@angular/core/testing';

import { RegisterUtilService } from './register-util.service';

describe('RegisterUtilService', () => {
  let service: RegisterUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
