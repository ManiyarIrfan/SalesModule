import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpInteractionComponent } from './emp-interaction.component';

describe('EmpInteractionComponent', () => {
  let component: EmpInteractionComponent;
  let fixture: ComponentFixture<EmpInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
