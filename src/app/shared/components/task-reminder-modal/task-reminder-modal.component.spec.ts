import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskReminderModalComponent } from './task-reminder-modal.component';

describe('TaskReminderModalComponent', () => {
  let component: TaskReminderModalComponent;
  let fixture: ComponentFixture<TaskReminderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskReminderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskReminderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
