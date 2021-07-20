import { ProjectModule } from './project.module';

describe('BlankPageModule', () => {
    let projectModule: ProjectModule;

    beforeEach(() => {
        projectModule = new ProjectModule();
    });

    it('should create an instance', () => {
        expect(projectModule).toBeTruthy();
    });
});
