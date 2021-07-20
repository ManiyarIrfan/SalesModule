import { EmployeeLayoutModule } from './employee-layout.module';

describe('EmployeeLayoutModule', () => {
    let employeeLayoutModule: EmployeeLayoutModule;

    beforeEach(() => {
        employeeLayoutModule = new EmployeeLayoutModule();
    });

    it('should create an instance', () => {
        expect(employeeLayoutModule).toBeTruthy();
    });
});
