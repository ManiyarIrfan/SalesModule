import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabLeadBysourceComponent } from './sub-tab-lead-bysource.component';

describe('SubTabLeadBysourceComponent', () => {
  let component: SubTabLeadBysourceComponent;
  let fixture: ComponentFixture<SubTabLeadBysourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabLeadBysourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabLeadBysourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
