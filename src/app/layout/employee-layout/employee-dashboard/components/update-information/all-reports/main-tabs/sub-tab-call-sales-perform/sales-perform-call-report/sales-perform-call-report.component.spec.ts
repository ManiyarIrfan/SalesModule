import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPerformCallReportComponent } from './sales-perform-call-report.component';

describe('SalesPerformCallReportComponent', () => {
  let component: SalesPerformCallReportComponent;
  let fixture: ComponentFixture<SalesPerformCallReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPerformCallReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPerformCallReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
