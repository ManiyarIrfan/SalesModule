import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSalesInteractionComponent } from './create-sales-interaction.component';

describe('CreateSalesInteractionComponent', () => {
  let component: CreateSalesInteractionComponent;
  let fixture: ComponentFixture<CreateSalesInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSalesInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSalesInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
