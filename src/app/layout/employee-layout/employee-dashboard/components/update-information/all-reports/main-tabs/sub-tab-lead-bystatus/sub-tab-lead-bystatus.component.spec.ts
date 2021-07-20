import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabLeadBystatusComponent } from './sub-tab-lead-bystatus.component';

describe('SubTabLeadBystatusComponent', () => {
  let component: SubTabLeadBystatusComponent;
  let fixture: ComponentFixture<SubTabLeadBystatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabLeadBystatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabLeadBystatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
