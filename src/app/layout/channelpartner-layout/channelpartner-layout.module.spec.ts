import { ChannelpartnerLayoutModule } from './channelpartner-layout.module';

describe('EmployeeLayoutModule', () => {
    let channelpartnerLayoutModule: ChannelpartnerLayoutModule;

    beforeEach(() => {
        channelpartnerLayoutModule = new ChannelpartnerLayoutModule();
    });
    it('should create an instance', () => {
        expect(channelpartnerLayoutModule).toBeTruthy();
    });
});
