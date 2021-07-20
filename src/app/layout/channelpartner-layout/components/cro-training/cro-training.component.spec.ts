import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CroTrainingComponent } from './cro-training.component';

describe('CroTrainingComponent', () => {
  let component: CroTrainingComponent;
  let fixture: ComponentFixture<CroTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CroTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CroTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
