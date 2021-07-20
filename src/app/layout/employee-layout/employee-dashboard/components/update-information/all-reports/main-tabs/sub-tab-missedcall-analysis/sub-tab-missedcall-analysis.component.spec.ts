import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabMissedcallAnalysisComponent } from './sub-tab-missedcall-analysis.component';

describe('SubTabMissedcallAnalysisComponent', () => {
  let component: SubTabMissedcallAnalysisComponent;
  let fixture: ComponentFixture<SubTabMissedcallAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabMissedcallAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabMissedcallAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
