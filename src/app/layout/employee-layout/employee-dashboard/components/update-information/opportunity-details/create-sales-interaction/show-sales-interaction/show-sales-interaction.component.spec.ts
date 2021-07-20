import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSalesInteractionComponent } from './show-sales-interaction.component';

describe('ShowSalesInteractionComponent', () => {
  let component: ShowSalesInteractionComponent;
  let fixture: ComponentFixture<ShowSalesInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSalesInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSalesInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
