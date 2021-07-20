import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingDailyComponent } from './outgoing-daily.component';

describe('OutgoingDailyComponent', () => {
  let component: OutgoingDailyComponent;
  let fixture: ComponentFixture<OutgoingDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
