
export interface ItotalSalesData {
    Total_Calls: number;
    Total_Talktime: number;
    SiteVisit_Scheduled: string;

}

export interface ItotalpreSalesData {
    Total_Calls: number;
    Total_Talktime: number;
    Total_booking: string;
    Total_Leads: number;
    SiteVisit_Scheduled: string;
}

export interface ItotalSiteLevelData {
    Total_Leads: string;
    Total_booking: string;
}
export interface IfilterDataModel {
    Name: string;
    BrokerName: string;
    MobileNo: number;
    Source: string;
    UserType: string;
    Details: string;
    FeedbackFrom: string;
}
export interface IfilterDataModelDashboard {
    OrderId: number;
    BookingDate: string;
    LeadName: string;
    MobileNo: number;
    OrderStatus: string;
    AgreementDate: string;
    SalesAgentId: string;
}
export interface IselectedProjectName {
    Address1: string;
    Address2: string;
    AvgRate: number;
    City: string;
    Country: string;
    IsActive: true;
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
    ReraRegistrationNo: number
    State: string;
    TenantId: number;
    TotalBuilding: number;
}
export interface IrefToSiteVisitRatio {
    SiteVisitOnProject: string;
}
export interface IsiteToOrderRatio {
    SiteVisitOnProject: string;
}
export interface IspendRatio {
    SiteVisitOnProject: string;
}
export interface IratioModel {
    totalSpend: number;
    searchProjectName: string;
}
export interface ISearchModel{
    PresalesId:number;
    ProjectId:number;
}

export interface IFIlterTable{
    Name:string,
    Role:string,
    Project:string,
    Total_Calls:string,
    Total_Talktime:string,
    SiteVisit_Scheduled:string,
    SiteVisit_Conducted:string,
    Bookings:string,
}