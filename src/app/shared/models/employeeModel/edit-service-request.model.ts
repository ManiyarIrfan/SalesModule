export interface IreportIssueModel {
    ProjectName: string;
    Building: string;
    Flat: number;
    IssueSubject: string;
    IssueDate: Date;
    IssueType: string;
    AssignedTo: string;
    Details: string;
    EnteredById: string;
    ImageUrl: string;
    IssueStatus: string;
}
export interface IfilterDataModel {
    IssueStatus: string;
    IssueId: number;
    CreatedBy: string;
    ModuleName: string;
    IssueSubject: string;
}
export interface IsessionModel {
    EntityId:number;
}