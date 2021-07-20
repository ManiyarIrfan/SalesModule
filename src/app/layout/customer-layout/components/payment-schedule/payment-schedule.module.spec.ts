import { PaymentScheduleModule } from './payment-schedule.module';

describe('PaymentScheduleModule', () => {
    let paymentScheduleModule: PaymentScheduleModule;

    beforeEach(() => {
        paymentScheduleModule = new PaymentScheduleModule();
    });

    it('should create an instance', () => {
        expect(paymentScheduleModule).toBeTruthy();
    });
});
