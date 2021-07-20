import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatementComponent } from './payment-statement.component';

describe('PaymentStatementComponent', () => {
    let component: PaymentStatementComponent;
    let fixture: ComponentFixture<PaymentStatementComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [PaymentStatementComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentStatementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
