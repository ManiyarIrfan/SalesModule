import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingCallReportsComponent } from './outgoing-call-reports.component';

describe('OutgoingCallReportsComponent', () => {
  let component: OutgoingCallReportsComponent;
  let fixture: ComponentFixture<OutgoingCallReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingCallReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingCallReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
