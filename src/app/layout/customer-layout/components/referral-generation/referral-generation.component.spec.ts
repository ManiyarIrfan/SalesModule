import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralGenerationComponent } from './referral-generation.component';

describe('ReferralGenerationComponent', () => {
    let component: ReferralGenerationComponent;
    let fixture: ComponentFixture<ReferralGenerationComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [ReferralGenerationComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ReferralGenerationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
