import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpmComponent } from './dpm.component';

describe('DpmComponent', () => {
  let component: DpmComponent;
  let fixture: ComponentFixture<DpmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
