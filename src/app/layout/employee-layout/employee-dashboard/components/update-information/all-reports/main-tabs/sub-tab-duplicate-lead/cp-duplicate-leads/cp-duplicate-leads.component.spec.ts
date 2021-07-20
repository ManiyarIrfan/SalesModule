import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDuplicateLeadsComponent } from './cp-duplicate-leads.component';

describe('CpDuplicateLeadsComponent', () => {
  let component: CpDuplicateLeadsComponent;
  let fixture: ComponentFixture<CpDuplicateLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDuplicateLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDuplicateLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
