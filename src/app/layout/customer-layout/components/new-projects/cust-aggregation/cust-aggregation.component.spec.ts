import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustAggregationComponent } from './cust-aggregation.component';

describe('CustAggregationComponent', () => {
  let component: CustAggregationComponent;
  let fixture: ComponentFixture<CustAggregationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustAggregationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
