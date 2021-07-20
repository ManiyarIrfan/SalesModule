import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabUnqualifiedLeadanalysisComponent } from './sub-tab-unqualified-leadanalysis.component';

describe('SubTabUnqualifiedLeadanalysisComponent', () => {
  let component: SubTabUnqualifiedLeadanalysisComponent;
  let fixture: ComponentFixture<SubTabUnqualifiedLeadanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabUnqualifiedLeadanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabUnqualifiedLeadanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
