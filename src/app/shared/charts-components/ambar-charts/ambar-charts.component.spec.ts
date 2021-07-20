import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbarChartsComponent } from './ambar-charts.component';

describe('AmbarChartsComponent', () => {
  let component: AmbarChartsComponent;
  let fixture: ComponentFixture<AmbarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbarChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
