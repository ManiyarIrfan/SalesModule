import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XfactorLayoutComponent } from './xfactor-layout.component';

describe('XfactorLayoutComponent', () => {
  let component: XfactorLayoutComponent;
  let fixture: ComponentFixture<XfactorLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XfactorLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XfactorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
