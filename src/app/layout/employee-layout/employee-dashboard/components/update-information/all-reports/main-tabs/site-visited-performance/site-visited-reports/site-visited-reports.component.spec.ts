import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitedReportsComponent } from './site-visited-reports.component';

describe('SiteVisitedReportsComponent', () => {
  let component: SiteVisitedReportsComponent;
  let fixture: ComponentFixture<SiteVisitedReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitedReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
