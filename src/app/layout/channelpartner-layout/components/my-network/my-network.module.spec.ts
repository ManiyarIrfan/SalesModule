import { MyNetworkModule } from './my-network.module';

describe('MyNetworkModule', () => {
    let myNetworkModule: MyNetworkModule;

    beforeEach(() => {
        myNetworkModule = new MyNetworkModule();
    });

    it('should create an instance', () => {
        expect(myNetworkModule).toBeTruthy();
    });
});
