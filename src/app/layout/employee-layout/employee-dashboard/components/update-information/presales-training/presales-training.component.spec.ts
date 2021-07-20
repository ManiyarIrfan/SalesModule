import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresalesTrainingComponent } from './presales-training.component';

describe('PresalesTrainingComponent', () => {
  let component: PresalesTrainingComponent;
  let fixture: ComponentFixture<PresalesTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresalesTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresalesTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
