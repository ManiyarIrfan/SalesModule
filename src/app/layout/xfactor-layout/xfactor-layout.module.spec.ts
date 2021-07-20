import { XfactorLayoutModule } from './xfactor-layout.module';

describe('XfactorLayoutModule', () => {
    let xfactorLayoutModule: XfactorLayoutModule;

    beforeEach(() => {
        xfactorLayoutModule = new XfactorLayoutModule();
    });

    it('should create an instance', () => {
        expect(xfactorLayoutModule).toBeTruthy();
    });
});
