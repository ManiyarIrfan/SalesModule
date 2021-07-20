import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAgreementStatusComponent } from './emp-agreement-status.component';

describe('EmpAgreementStatusComponent', () => {
  let component: EmpAgreementStatusComponent;
  let fixture: ComponentFixture<EmpAgreementStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpAgreementStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAgreementStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
