import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCommunityComponent } from './project-community.component';

describe('ProjectCommunityComponent', () => {
  let component: ProjectCommunityComponent;
  let fixture: ComponentFixture<ProjectCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
