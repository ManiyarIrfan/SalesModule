import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCommunityComponent } from './events-community.component';

describe('EventsCommunityComponent', () => {
  let component: EventsCommunityComponent;
  let fixture: ComponentFixture<EventsCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
