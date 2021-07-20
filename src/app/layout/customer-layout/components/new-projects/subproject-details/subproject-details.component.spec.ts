import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubprojectDetailsComponent } from './subproject-details.component';

describe('SubprojectDetailsComponent', () => {
  let component: SubprojectDetailsComponent;
  let fixture: ComponentFixture<SubprojectDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubprojectDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubprojectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
