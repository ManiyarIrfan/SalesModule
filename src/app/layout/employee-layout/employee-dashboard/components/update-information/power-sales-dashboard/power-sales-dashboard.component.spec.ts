import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSalesDashboardComponent } from './power-sales-dashboard.component';

describe('PowerSalesDashboardComponent', () => {
  let component: PowerSalesDashboardComponent;
  let fixture: ComponentFixture<PowerSalesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerSalesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSalesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
