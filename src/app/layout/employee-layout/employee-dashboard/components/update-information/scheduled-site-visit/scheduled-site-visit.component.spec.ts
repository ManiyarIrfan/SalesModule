import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledSiteVisitComponent } from './scheduled-site-visit.component';

describe('ScheduledSiteVisitComponent', () => {
  let component: ScheduledSiteVisitComponent;
  let fixture: ComponentFixture<ScheduledSiteVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledSiteVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledSiteVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
