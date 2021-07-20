import { PaymentStatementModule } from './payment-statement.module';

describe('PaymentStatementModule', () => {
    let paymentStatementModule: PaymentStatementModule;

    beforeEach(() => {
        paymentStatementModule = new PaymentStatementModule();
    });

    it('should create an instance', () => {
        expect(paymentStatementModule).toBeTruthy();
    });
});
