import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDiscussionComponent } from './single-discussion.component';

describe('SingleDiscussionComponent', () => {
  let component: SingleDiscussionComponent;
  let fixture: ComponentFixture<SingleDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
