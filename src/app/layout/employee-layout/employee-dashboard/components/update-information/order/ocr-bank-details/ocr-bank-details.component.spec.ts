import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrBankDetailsComponent } from './ocr-bank-details.component';

describe('OcrBankDetailsComponent', () => {
  let component: OcrBankDetailsComponent;
  let fixture: ComponentFixture<OcrBankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
