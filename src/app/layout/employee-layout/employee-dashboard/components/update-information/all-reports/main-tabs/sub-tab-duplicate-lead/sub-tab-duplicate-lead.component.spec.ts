import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabDuplicateLeadComponent } from './sub-tab-duplicate-lead.component';

describe('SubTabDuplicateLeadComponent', () => {
  let component: SubTabDuplicateLeadComponent;
  let fixture: ComponentFixture<SubTabDuplicateLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabDuplicateLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabDuplicateLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
