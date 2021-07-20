import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaddocComponent } from './uploaddoc.component';

describe('UploaddocComponent', () => {
  let component: UploaddocComponent;
  let fixture: ComponentFixture<UploaddocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploaddocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaddocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
