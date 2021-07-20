import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectDetailsComponent } from './architect-details.component';

describe('ArchitectDetailsComponent', () => {
  let component: ArchitectDetailsComponent;
  let fixture: ComponentFixture<ArchitectDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchitectDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
