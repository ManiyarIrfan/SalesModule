import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPaymentScheduleComponent } from './emp-payment-schedule.component';

describe('EmpPaymentScheduleComponent', () => {
  let component: EmpPaymentScheduleComponent;
  let fixture: ComponentFixture<EmpPaymentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpPaymentScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpPaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
