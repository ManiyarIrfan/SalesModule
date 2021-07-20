import { TestBed } from '@angular/core/testing';

import { TaskReminderModalService } from './task-reminder-modal.service';

describe('TaskReminderModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskReminderModalService = TestBed.get(TaskReminderModalService);
    expect(service).toBeTruthy();
  });
});
