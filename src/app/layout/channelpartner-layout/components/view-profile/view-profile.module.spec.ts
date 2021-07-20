import { ViewProfileModule } from './view-profile.module';

describe('ViewProfileModule', () => {
    let viewProfileModule: ViewProfileModule;

    beforeEach(() => {
        viewProfileModule = new ViewProfileModule();
    });

    it('should create an instance', () => {
        expect(viewProfileModule).toBeTruthy();
    });
});
