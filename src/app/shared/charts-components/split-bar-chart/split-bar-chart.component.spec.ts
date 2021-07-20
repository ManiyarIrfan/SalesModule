import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitBarChartComponent } from './split-bar-chart.component';

describe('SplitBarChartComponent', () => {
  let component: SplitBarChartComponent;
  let fixture: ComponentFixture<SplitBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
