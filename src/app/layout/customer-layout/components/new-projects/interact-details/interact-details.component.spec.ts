import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractDetailsComponent } from './interact-details.component';

describe('InteractDetailsComponent', () => {
  let component: InteractDetailsComponent;
  let fixture: ComponentFixture<InteractDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
