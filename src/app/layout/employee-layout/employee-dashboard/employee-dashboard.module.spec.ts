import { EmployeeDashboardModule } from './employee-dashboard.module';

describe('EmployeeDashboardModule', () => {
  let employeeDashboardModule: EmployeeDashboardModule;

  beforeEach(() => {
    employeeDashboardModule = new EmployeeDashboardModule();
  });

  it('should create an instance', () => {
    expect(employeeDashboardModule).toBeTruthy();
  });
});
