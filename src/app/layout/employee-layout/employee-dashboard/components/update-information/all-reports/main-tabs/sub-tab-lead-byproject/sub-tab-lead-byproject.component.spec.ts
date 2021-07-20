import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabLeadByprojectComponent } from './sub-tab-lead-byproject.component';

describe('SubTabLeadByprojectComponent', () => {
  let component: SubTabLeadByprojectComponent;
  let fixture: ComponentFixture<SubTabLeadByprojectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabLeadByprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabLeadByprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
