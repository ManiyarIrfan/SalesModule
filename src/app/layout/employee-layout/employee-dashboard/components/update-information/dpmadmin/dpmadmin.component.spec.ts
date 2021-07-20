import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpmadminComponent } from './dpmadmin.component';

describe('DpmadminComponent', () => {
  let component: DpmadminComponent;
  let fixture: ComponentFixture<DpmadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpmadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpmadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
