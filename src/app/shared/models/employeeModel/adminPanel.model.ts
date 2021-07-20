import { Time } from '@angular/common';

export interface IsourcecampaignModel {
    Name: string,
    Type: string,
    campaignNo: number;
}
export interface IselectedProjectNames {
    Address1: string;
    Address2: string;
    AvgRate: number;
    City: string;
    Country: string;
    IsActive: boolean;
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
export interface IselectedEmployeeRoles {
    Id: number;
    Role: string;
    Type: string;

}
export interface IselectedEmployeeName {
    EmployeeId: number;
    Id: number;
    Name: string;
    Role: number;
    UserId: string;

}
export interface IselectedLocations {
    Location: string;
    TenantId: number;
}
export interface IEmployeeDetail {
    AssingedArea: string;
    AssingedProject1: string;
    AssingedProject2: string;
    AssingedProject3: string;
    City: string;
    Email: string;
    EmployeeId: number;
    EmployeeStatus: string;
    EndTime: Time;
    EngagementType: string;
    FirstName: string;
    Id: number;
    LastName: string;
    Level: string;
    MobileNo: number;
    ModuleName: string;
    NoLeadsDay: string;
    ReportingTo: string;
    Role: string;
    StartTime: Time;
    SwitchRole: string;
    UpdatedBy: string;
    WeeklyOff: string;
}
export interface IemployeeName {
    Email: string;
    EmployeeId: number;
    Id: number;
    IsActive: boolean;
    MobileNo: number;
    Name: string;
}
export interface IallLogDetails {
    Name: string;
    MobileNo: number;
    Email: string;
    Type: string;
    length: number;
}
export interface IenquiryEmployeeName {
    Email: string;
    EmployeeId: number;
    Id: number;
    IsActive: boolean;
    MobileNo: number;
    Name: string;

}
export interface IadminPanelModel {
    EmployeeId: number;
    Id: string;
    UserType: string;
    WeeklyOff:string[];
    AssingedArea: string;
    AssingedCity: string;
    AssingedProject1: string;
    AssingedProject2: string;
    AssingedProject3: string;
    Email: string;
    EngagementType: string;
    FirstName: string;
    LastName: string;
    Level: string;
    MobileNo: string;
    noleadsDay: string[];
    ReportingTo:number;
    Role: string;
    SwitchRole: boolean;
    UMID: number;
    ModuleName: string;
    City: string;
    registerTemp: boolean;
}
export interface IselectedChannelPartnerNames {
    BrokerId: number;
    Name: string;
    Organization: string;
    Type: string;
    ReraNo: number;
    length: number;
}
export interface IcpAdminPanelModel {
    Organisation: string;
    BrokerId: string;
    ProjectName: string;
    PanStatus: string;
}
export interface IfilterDataModel {
    PANVerificationStatus: string;
    AccType: string;
    PANType: string;
    PanNo: number;
    FullName: string;
}
export interface IimportModel {
    Source: string;
    Campaign: string;
}