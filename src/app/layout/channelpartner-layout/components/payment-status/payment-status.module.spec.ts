import { paymentstatusModule } from './payment-status.module';

describe('paymentstatusModule', () => {
    let PaymentstatusModule: paymentstatusModule;

    beforeEach(() => {
        PaymentstatusModule = new paymentstatusModule();
    });

    it('should create an instance', () => {
        expect(PaymentstatusModule).toBeTruthy();
    });
});
