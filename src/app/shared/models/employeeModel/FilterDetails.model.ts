//Project details component
export interface IfilterProjectModel {
    FlatNo: string,
    Floor: string,
    Available: string,
    LayoutType: string,
    FlatViews: string,
    BHK: string,
    FlatView: string,
}
export interface IfilterFrontDeskLeadStatus {
    EnquiryId: string,
    LeadId: string,
    Name: string,
    Source: string,
    ProjectName: string,
    frontdesk: string,
    SalesAgentAssinged: string,
    PresalesAgentName: string,
    ReferralStatus: string,
    ReferralBy: string,
    ReferralId: string,
    CreatedBy: string,
    TReferralId: string
}
export interface IfilterSubTanCon {
    PreferredProject: string,
    AgentName: string,
    LeadName: string,
    Duration: number,
    PresalesAgentName: string,
    SalesAgentAssigned: string,
    CreatedOn: string,
    SiteVisitSchedule: string,
    ConductedOn: string,
    Status: string,
    BookingStatus: string,
    callAttendedBy: string,
}
export interface IfilterDataModel {
    CPName: string,
    Organization: string,
    MobileNo: number,
    City:string,
    State:string

}
export interface IUserfilterDataModel {
    Name: string,
    Email: string,
    Entityid: number;
}
export interface IfilterReferralDataModel {
    Name: string,
    Email: string,
    MobileNo: number,
    Status: string,
    VerificationStatus: string
}
export interface IfilterInvoiceDataModel {
    OrderId: number,
    CustomerName: string,
    BrokerName: string,
    BrokerMobileNo: number,
    VerificationStatus: string,
}
export interface IleadData {
    amount: number,
    Name: string
}

export interface IrefModel {
    newReferral: string,
    Status: string,
    TReferralId: number,
    Name: string,
    ReferredByType: string,
    ReferredBy: number,
    ReferredType: string,
    Remark: string
}
