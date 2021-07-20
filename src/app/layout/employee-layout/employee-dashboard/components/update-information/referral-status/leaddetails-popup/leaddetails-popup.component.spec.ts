import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaddetailsPopupComponent } from './leaddetails-popup.component';

describe('LeaddetailsPopupComponent', () => {
  let component: LeaddetailsPopupComponent;
  let fixture: ComponentFixture<LeaddetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaddetailsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaddetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
