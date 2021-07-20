import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaModuleComponent } from './idea-module.component';

describe('IdeaModuleComponent', () => {
  let component: IdeaModuleComponent;
  let fixture: ComponentFixture<IdeaModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeaModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
