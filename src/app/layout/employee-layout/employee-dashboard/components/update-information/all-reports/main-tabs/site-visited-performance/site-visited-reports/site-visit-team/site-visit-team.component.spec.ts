import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitTeamComponent } from './site-visit-team.component';

describe('SiteVisitTeamComponent', () => {
  let component: SiteVisitTeamComponent;
  let fixture: ComponentFixture<SiteVisitTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
