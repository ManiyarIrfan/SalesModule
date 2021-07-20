import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelpartnerAdminControlComponent } from './channelpartner-admin-control.component';

describe('ChannelpartnerAdminControlComponent', () => {
  let component: ChannelpartnerAdminControlComponent;
  let fixture: ComponentFixture<ChannelpartnerAdminControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelpartnerAdminControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelpartnerAdminControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
