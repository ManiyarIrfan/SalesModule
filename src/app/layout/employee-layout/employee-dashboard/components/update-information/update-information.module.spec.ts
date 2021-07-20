import { UpdateInformationModule } from './update-information.module';

describe('updateInformationModule', () => {
    let updateInformationModule: UpdateInformationModule;

    beforeEach(() => {
        updateInformationModule = new UpdateInformationModule();
    });

    it('should create an instance', () => {
        expect(updateInformationModule).toBeTruthy();
    });
});
