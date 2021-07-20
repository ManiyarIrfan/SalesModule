import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailLeadInteractionComponent } from './send-email-lead-interaction.component';

describe('SendEmailLeadInteractionComponent', () => {
  let component: SendEmailLeadInteractionComponent;
  let fixture: ComponentFixture<SendEmailLeadInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailLeadInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailLeadInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
