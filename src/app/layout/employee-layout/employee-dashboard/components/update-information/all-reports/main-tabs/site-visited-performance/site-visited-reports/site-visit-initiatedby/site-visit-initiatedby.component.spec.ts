import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitInitiatedbyComponent } from './site-visit-initiatedby.component';

describe('SiteVisitInitiatedbyComponent', () => {
  let component: SiteVisitInitiatedbyComponent;
  let fixture: ComponentFixture<SiteVisitInitiatedbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitInitiatedbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitInitiatedbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
