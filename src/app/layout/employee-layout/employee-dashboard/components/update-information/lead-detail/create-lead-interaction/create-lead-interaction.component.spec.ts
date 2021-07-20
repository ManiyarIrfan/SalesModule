import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeadInteractionComponent } from './create-lead-interaction.component';

describe('CreateLeadInteractionComponent', () => {
  let component: CreateLeadInteractionComponent;
  let fixture: ComponentFixture<CreateLeadInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLeadInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeadInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
