export interface IreportIssueModel {
    Building: string;
    Details: string;
    EmployeeName: string;
    EntityId: number;
    Flat: number;
    ImageUrl: string;
    IsActive: true
    IssueDate: number;
    IssueId: number;
    IssueStatus: string;
    IssueSubType: string;
    IssueSubject: string;
    IssueType: string;
    ModuleName: string;
    ProjectName: string;
}
export interface IsessionModel {
    Building: number;
    Details: string;
    Flat: number;
    IssueDate: number;
    IssueSubject: string;
    IssueType: string;
    ProjectName: string;
    EntityId: number;
}
export interface IshowServiceRequest {
    Building: number;
    Details: string;
    EmployeeName: string;
    EntityId: number;
    Flat: number;
    ImageUrl: string;
    IsActive: boolean;
    IssueDate: Date;
    IssueId: number;
    IssueStatus: string;
    IssueSubType: string;
    IssueSubject: string;
    IssueType: string;
    ModuleName: string;
    ProjectName: string;
}