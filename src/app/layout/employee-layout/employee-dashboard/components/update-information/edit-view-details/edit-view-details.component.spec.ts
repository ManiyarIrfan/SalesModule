import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViewDetailsComponent } from './edit-view-details.component';

describe('EditViewDetailsComponent', () => {
  let component: EditViewDetailsComponent;
  let fixture: ComponentFixture<EditViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
