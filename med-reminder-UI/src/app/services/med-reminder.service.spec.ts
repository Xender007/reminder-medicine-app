import { TestBed } from '@angular/core/testing';

import { MedReminderService } from './med-reminder.service';

describe('MedReminderService', () => {
  let service: MedReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
