import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallStatsSalesComponent } from './call-stats-sales.component';

describe('CallStatsSalesComponent', () => {
  let component: CallStatsSalesComponent;
  let fixture: ComponentFixture<CallStatsSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallStatsSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallStatsSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
