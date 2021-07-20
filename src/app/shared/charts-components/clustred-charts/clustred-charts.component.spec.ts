import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClustredChartsComponent } from './clustred-charts.component';

describe('ClustredChartsComponent', () => {
  let component: ClustredChartsComponent;
  let fixture: ComponentFixture<ClustredChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClustredChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClustredChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
