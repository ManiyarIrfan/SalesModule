import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFinancialStatusComponent } from './emp-financial-status.component';

describe('EmpFinancialStatusComponent', () => {
  let component: EmpFinancialStatusComponent;
  let fixture: ComponentFixture<EmpFinancialStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpFinancialStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpFinancialStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
