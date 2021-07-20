import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabEnquiryUntouchedAnalysisComponent } from './sub-tab-enquiry-untouched-analysis.component';

describe('SubTabEnquiryUntouchedAnalysisComponent', () => {
  let component: SubTabEnquiryUntouchedAnalysisComponent;
  let fixture: ComponentFixture<SubTabEnquiryUntouchedAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabEnquiryUntouchedAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabEnquiryUntouchedAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
