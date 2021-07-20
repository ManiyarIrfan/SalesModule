import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPaymentStatusComponent } from './cp-payment-status.component';

describe('CpPaymentStatusComponent', () => {
  let component: CpPaymentStatusComponent;
  let fixture: ComponentFixture<CpPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
