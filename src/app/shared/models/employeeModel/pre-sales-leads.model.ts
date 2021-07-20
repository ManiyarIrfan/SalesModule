export interface IfilterpreSalesleadsModel {
    EnquiryId: string,
    Name: string,
    Bhk: string,
    RequirementType: string,
    PreferredCity: string,
    PreferredLocation: string,
    PreferredProject: string,
    EnquiryStatus: string,
    Budget: string,
    Source: string,
    CreatedOn: string,
    ReengagedOn: string,
    Counter: string,
    FollowUpStatus: string,
    FollowUpType: string,
    PreferredDate: string,
    PresalesAgentAssigned: string,
    TypeOfLead: string,
    ContactedBy: string,
    PropertyType: string,
    MsgDetails: string,
    SubSource: string,
    Campaign: string
}
export interface IenquiryRegModel {
    refFirst: string;
    refLast: string;
    refCountryCode: number;
    refMobileNo: number;
    refEmail: string;
    PropertyType: string;
    Source: string;
    preCity: string;
    PreferredProject: string;
    Budget: string;
    City: string;
    TypeOfLead: string;
    ContactedBy: number;
    MsgDetails: string;
    Campaign: string;

}
export interface IselectedDateRange {
    startDate: string;
    endDate: string;
}
export interface IreassignModel {
    PresalesAgentAssigned: string;
}
export interface IpresalesInfoModel {
    reportingNameId: number;
    ProjectId: number;
    Status: string;
}