import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityLayoutComponent } from './community-layout.component';

describe('CommunityLayoutComponent', () => {
  let component: CommunityLayoutComponent;
  let fixture: ComponentFixture<CommunityLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
