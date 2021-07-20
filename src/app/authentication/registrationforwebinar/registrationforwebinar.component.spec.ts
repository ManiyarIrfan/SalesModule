import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationforwebinarComponent } from './registrationforwebinar.component';

describe('RegistrationforwebinarComponent', () => {
  let component: RegistrationforwebinarComponent;
  let fixture: ComponentFixture<RegistrationforwebinarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationforwebinarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationforwebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
