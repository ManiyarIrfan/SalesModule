export interface IreportIssueModel {
    ProjectName: string;
    Building: string;
    Flat: number;
    IssueDate: Date;
    IssueType: string;
    IssueSubject: string;
    Details: string;
}
export interface IsessionModel {
    EntityId: number;
}
export interface IselectedProjectNames {
    Address1: string;
    Address2: string;
    AvgRate: number;
    City: string;
    Country: string;
    Landmark: string;
    Latitude: number;
    Location: string;
    Longitude: number;
    NoOfFlat: number;
    PinCode: number;
    ProjectId: number;
    ProjectImage: string;
    ProjectName: string;
    ProjectType: string;
    Rate: number;
    ReraApproval: string;
    ReraRegistrationNo: number;
    State: string;
    TotalBuilding: number;
}