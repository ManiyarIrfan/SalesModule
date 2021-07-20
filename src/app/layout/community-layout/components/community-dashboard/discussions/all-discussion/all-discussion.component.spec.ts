import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDiscussionComponent } from './all-discussion.component';

describe('AllDiscussionComponent', () => {
  let component: AllDiscussionComponent;
  let fixture: ComponentFixture<AllDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
