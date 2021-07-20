import { ProjectStatusModule } from './project-status.module';

describe('ProjectStatusModule', () => {
    let projectStatusModule: ProjectStatusModule;

    beforeEach(() => {
        projectStatusModule = new ProjectStatusModule();
    });

    it('should create an instance', () => {
        expect(projectStatusModule).toBeTruthy();
    });
});
