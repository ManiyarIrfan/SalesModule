import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabCallCallStatsComponent } from './sub-tab-call-call-stats.component';

describe('SubTabCallCallStatsComponent', () => {
  let component: SubTabCallCallStatsComponent;
  let fixture: ComponentFixture<SubTabCallCallStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabCallCallStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabCallCallStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
