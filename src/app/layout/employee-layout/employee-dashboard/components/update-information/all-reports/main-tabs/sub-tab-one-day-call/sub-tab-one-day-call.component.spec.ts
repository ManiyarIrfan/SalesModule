import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabOneDayCallComponent } from './sub-tab-one-day-call.component';

describe('SubTabOneDayCallComponent', () => {
  let component: SubTabOneDayCallComponent;
  let fixture: ComponentFixture<SubTabOneDayCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabOneDayCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabOneDayCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
