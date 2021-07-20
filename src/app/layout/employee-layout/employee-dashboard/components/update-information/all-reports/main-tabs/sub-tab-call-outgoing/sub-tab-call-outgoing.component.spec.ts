import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabCallOutgoingComponent } from './sub-tab-call-outgoing.component';

describe('SubTabCallOutgoingComponent', () => {
  let component: SubTabCallOutgoingComponent;
  let fixture: ComponentFixture<SubTabCallOutgoingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabCallOutgoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabCallOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
