import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskLeadStatusComponent } from './front-desk-lead-status.component';

describe('FrontDeskLeadStatusComponent', () => {
  let component: FrontDeskLeadStatusComponent;
  let fixture: ComponentFixture<FrontDeskLeadStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskLeadStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskLeadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
