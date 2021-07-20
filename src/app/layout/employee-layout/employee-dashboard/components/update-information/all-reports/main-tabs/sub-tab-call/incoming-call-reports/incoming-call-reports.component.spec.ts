import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingCallReportsComponent } from './incoming-call-reports.component';

describe('IncomingCallReportsComponent', () => {
  let component: IncomingCallReportsComponent;
  let fixture: ComponentFixture<IncomingCallReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingCallReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingCallReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
