import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallStatsTeamComponent } from './call-stats-team.component';

describe('CallStatsTeamComponent', () => {
  let component: CallStatsTeamComponent;
  let fixture: ComponentFixture<CallStatsTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallStatsTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallStatsTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
