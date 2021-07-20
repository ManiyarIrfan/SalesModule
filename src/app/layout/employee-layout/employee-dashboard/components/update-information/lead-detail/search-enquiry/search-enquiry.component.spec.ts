import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEnquiryComponent } from './search-enquiry.component';

describe('SearchEnquiryComponent', () => {
  let component: SearchEnquiryComponent;
  let fixture: ComponentFixture<SearchEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
