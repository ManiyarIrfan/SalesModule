import { reportissuesModule } from './report-issues.module';

describe('report-issuesModule', () => {
    let ReportissuesModule: reportissuesModule;

    beforeEach(() => {
        ReportissuesModule = new reportissuesModule();
    });

    it('should create an instance', () => {
        expect(ReportissuesModule).toBeTruthy();
    });
});
