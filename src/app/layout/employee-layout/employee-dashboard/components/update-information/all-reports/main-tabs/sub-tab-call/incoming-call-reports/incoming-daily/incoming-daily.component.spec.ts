import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingDailyComponent } from './incoming-daily.component';

describe('IncomingDailyComponent', () => {
  let component: IncomingDailyComponent;
  let fixture: ComponentFixture<IncomingDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
