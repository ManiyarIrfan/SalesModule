import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabLeadBycampaignComponent } from './sub-tab-lead-bycampaign.component';

describe('SubTabLeadBycampaignComponent', () => {
  let component: SubTabLeadBycampaignComponent;
  let fixture: ComponentFixture<SubTabLeadBycampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTabLeadBycampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabLeadBycampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
