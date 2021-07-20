import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { paymentstatusComponent } from './payment-status.component';

describe('paymentstatusComponent', () => {
    let component: paymentstatusComponent;
    let fixture: ComponentFixture<paymentstatusComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [paymentstatusComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(paymentstatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
