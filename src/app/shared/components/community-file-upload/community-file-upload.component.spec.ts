import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityFileUploadComponent } from './community-file-upload.component';

describe('CommunityFileUploadComponent', () => {
  let component: CommunityFileUploadComponent;
  let fixture: ComponentFixture<CommunityFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
