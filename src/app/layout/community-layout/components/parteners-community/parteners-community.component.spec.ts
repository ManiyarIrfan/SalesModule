import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenersCommunityComponent } from './parteners-community.component';

describe('PartenersCommunityComponent', () => {
  let component: PartenersCommunityComponent;
  let fixture: ComponentFixture<PartenersCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartenersCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenersCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
