import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingHourlyComponent } from './incoming-hourly.component';

describe('IncomingHourlyComponent', () => {
  let component: IncomingHourlyComponent;
  let fixture: ComponentFixture<IncomingHourlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingHourlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingHourlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
