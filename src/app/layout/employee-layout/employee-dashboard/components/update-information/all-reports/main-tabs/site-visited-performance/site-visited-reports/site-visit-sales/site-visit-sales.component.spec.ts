import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitSalesComponent } from './site-visit-sales.component';

describe('SiteVisitSalesComponent', () => {
  let component: SiteVisitSalesComponent;
  let fixture: ComponentFixture<SiteVisitSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
