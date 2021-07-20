export interface IleadinfoDetails {
    Name: string;
    CreatedOn: Date;
    FirstName: string;
    LastName: string;
    EnquiryStatus: string;
    StatusChangeReason: string;
    CountryCode: number;
    PreferredProject: string;
    Budget: string;
    Email: string;
    AlternateEmail: string;
    Source: string;
    PresalesAgentAssigned: any;
    PropertyType: string;
    Bhk: number;
    Possession: string;
    PreferredLocation: string;
    PrimaryPurpose: string;
    FundingSource: string;
    Country: string;
    Occupation: string;
    ReportingTo: string;
    ReengagedSource: string;
    ReengagedSubSource: string;
    ReengagedCampaign: string;
    TEnquiryId: number;
    Remark: string;
    PreSalesEmployee: string;
    isEditPreSalesFields: boolean;
    IsNRI: boolean;

}
export interface IProjectNames {
    Address1: string;
    Address2: string;
    AvgRate: number;
    City: string;
    Country: string;
    IsActive: false;
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
    TenantId: number;
    TotalBuilding: number;
}
export interface IselectedEmployeeName {
    Email: string;
    EmployeeId: number;
    Id: number;
    IsActive: boolean;
    MobileNo: number;
    Name: string;
}
export interface IcallCheckList {
    Tag: string;
}
export interface IupdateRemark {
    Remark: string;
}
export interface IleadinfoDetails {
    FollowUpTime: string;
    FollowUpDate: string;
    FollowUpStatus: string;
    Agenda: string;
    EnquiryId: number;
    FirstName: string;
    LastName: string;
    MobileNo: string;
    FollowUp: string;
    AlternateNo: string;

}
export interface IallProjectNames {
    ProjectName: string;
}
export interface IsiteVisitModel {
    PreferredProject: string;
    preDate: string;
    IsSVConfirm: boolean;
    Details: string;
    ProjectName: string;
}
export interface IEnquiryDetails {
    EnquiryId: number;
    FirstName: string;
    LastName: string;
    MobileNo: number;
    PreferredTime: string;
    EnquiryStatus: string;
    FollowUpDate: string;
    FollowUpTime: string;
    SalesAgentAssigned: string;
    PreferredDate: string;
    MobileNoforWA: number;
    DialNo: number;
}
export interface IcallDetails {
    StartTime: string;
    To: number;
    Direction: string;
    Status: string;
    length: number;
}
export interface ItestinteractionModel {
    CreatedBy: string;
    CreatedOn: Date;
    Details: string;
    EntityId: number;
    FollowUpRequired: null;
    InteractionId: number;
    InteractionType: string;
    IssueId: number;
    SiteVisitDuration: null;
    UserType: string;
}
export interface Iemailmodel {
    Subject: string;
    Details: string;
}
export interface IselectedProjectNames {
    ProjectName: string;
}
export interface IinteractionModel {
    interactionType: string;
    Details: string;
}
export interface IleadSiteInfo {
    ProjectName: string;
    InteractionType: string;
}
