import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CroAdminDashboardComponent } from './cro-admin-dashboard.component';

describe('CroAdminDashboardComponent', () => {
  let component: CroAdminDashboardComponent;
  let fixture: ComponentFixture<CroAdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CroAdminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CroAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
