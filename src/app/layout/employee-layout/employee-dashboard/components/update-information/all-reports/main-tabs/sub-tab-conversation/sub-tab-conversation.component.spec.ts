import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabConversationComponent } from './sub-tab-conversation.component';

describe('SubTabConversationComponent', () => {
  let component: SubTabConversationComponent;
  let fixture: ComponentFixture<SubTabConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
