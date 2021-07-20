import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabCallComponent } from './sub-tab-call.component';

describe('SubTabCallComponent', () => {
  let component: SubTabCallComponent;
  let fixture: ComponentFixture<SubTabCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
