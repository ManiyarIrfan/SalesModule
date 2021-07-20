import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabCallSalesPerformComponent } from './sub-tab-call-sales-perform.component';

describe('SubTabCallSalesPerformComponent', () => {
  let component: SubTabCallSalesPerformComponent;
  let fixture: ComponentFixture<SubTabCallSalesPerformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabCallSalesPerformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabCallSalesPerformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
