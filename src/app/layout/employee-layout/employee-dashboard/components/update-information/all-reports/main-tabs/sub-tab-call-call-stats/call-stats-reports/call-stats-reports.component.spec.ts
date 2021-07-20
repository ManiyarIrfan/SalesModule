import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallStatsReportsComponent } from './call-stats-reports.component';

describe('CallStatsReportsComponent', () => {
  let component: CallStatsReportsComponent;
  let fixture: ComponentFixture<CallStatsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallStatsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallStatsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
