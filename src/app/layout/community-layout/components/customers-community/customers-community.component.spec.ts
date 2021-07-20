import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCommunityComponent } from './customers-community.component';

describe('CustomersCommunityComponent', () => {
  let component: CustomersCommunityComponent;
  let fixture: ComponentFixture<CustomersCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
