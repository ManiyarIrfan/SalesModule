import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPerformPresalesComponent } from './sales-perform-presales.component';

describe('SalesPerformPresalesComponent', () => {
  let component: SalesPerformPresalesComponent;
  let fixture: ComponentFixture<SalesPerformPresalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPerformPresalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPerformPresalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
