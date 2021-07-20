import { ReferralStatusModule } from './referral-status.module';

describe('ReferralStatusModule', () => {
    let referralStatusModule: ReferralStatusModule;

    beforeEach(() => {
        referralStatusModule = new ReferralStatusModule();
    });

    it('should create an instance', () => {
        expect(referralStatusModule).toBeTruthy();
    });
});
