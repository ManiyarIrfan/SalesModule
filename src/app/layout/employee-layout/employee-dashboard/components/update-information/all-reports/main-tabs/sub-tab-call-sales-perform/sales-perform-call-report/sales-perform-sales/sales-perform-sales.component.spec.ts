import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPerformSalesComponent } from './sales-perform-sales.component';

describe('SalesPerformSalesComponent', () => {
  let component: SalesPerformSalesComponent;
  let fixture: ComponentFixture<SalesPerformSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPerformSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPerformSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
