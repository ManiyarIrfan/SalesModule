import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDetailsComponent } from './cp-details.component';

describe('CpDetailsComponent', () => {
  let component: CpDetailsComponent;
  let fixture: ComponentFixture<CpDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
