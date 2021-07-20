import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitedPerformanceComponent } from './site-visited-performance.component';

describe('SiteVisitedPerformanceComponent', () => {
  let component: SiteVisitedPerformanceComponent;
  let fixture: ComponentFixture<SiteVisitedPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitedPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitedPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
