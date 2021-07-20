import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingHourlyComponent } from './outgoing-hourly.component';

describe('OutgoingHourlyComponent', () => {
  let component: OutgoingHourlyComponent;
  let fixture: ComponentFixture<OutgoingHourlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingHourlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingHourlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
