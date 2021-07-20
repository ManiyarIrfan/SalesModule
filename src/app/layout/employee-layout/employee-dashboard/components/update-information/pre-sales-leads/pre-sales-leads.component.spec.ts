import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSalesLeadsComponent } from './pre-sales-leads.component';

describe('PreSalesLeadsComponent', () => {
  let component: PreSalesLeadsComponent;
  let fixture: ComponentFixture<PreSalesLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreSalesLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreSalesLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
