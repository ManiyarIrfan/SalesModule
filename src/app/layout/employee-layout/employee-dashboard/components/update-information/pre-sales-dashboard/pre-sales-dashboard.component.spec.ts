import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSalesDashboardComponent } from './pre-sales-dashboard.component';

describe('PreSalesDashboardComponent', () => {
  let component: PreSalesDashboardComponent;
  let fixture: ComponentFixture<PreSalesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreSalesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreSalesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
