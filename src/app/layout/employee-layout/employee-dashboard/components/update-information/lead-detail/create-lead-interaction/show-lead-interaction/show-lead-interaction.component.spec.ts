import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLeadInteractionComponent } from './show-lead-interaction.component';

describe('ShowLeadInteractionComponent', () => {
  let component: ShowLeadInteractionComponent;
  let fixture: ComponentFixture<ShowLeadInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLeadInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLeadInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
