import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiceRequestComponent } from './edit-service-request.component';

describe('EditServiceRequestComponent', () => {
  let component: EditServiceRequestComponent;
  let fixture: ComponentFixture<EditServiceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServiceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
