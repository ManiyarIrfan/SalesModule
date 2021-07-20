import { ReferralGenerationModule } from './referral-generation.module';

describe('ReferralGenerationModule', () => {
    let referralGenerationModule: ReferralGenerationModule;

    beforeEach(() => {
        referralGenerationModule = new ReferralGenerationModule();
    });

    it('should create an instance', () => {
        expect(referralGenerationModule).toBeTruthy();
    });
});
