export interface IleadDetails {
    Bhk: string;
    BrokerAssinged: string;
    BrokerAssingedId: number;
    Budget: number;
    CreatedOn: Date;
    CrmAssinged: string;
    Email: string;
    Face2Face: number;
    IncentivePraposed: number;
    MobileNo: number;
    Name: string;
    NoOfSiteVisit: number;
    Possession: string;
    PreferredCity: string;
    PreferredDate: Date;
    PreferredLocation: string;
    PreferredProject: string;
    PreferredTime: number;
    ReferralBy: string;
    ReferralId: number;
    ReferralStatus: string;
    SalesAgentAssinged: string;
    Source: string;
    TReferralId: number;
    UserType: string;
    iSACTIVE: boolean;
}
export interface IreportedBy {
    BrokerId: number;
    Name: string;
}
export interface IinteractionModel {
    CreatedBy: Date;
    CreatedOn: Date;
    InteractionType: string;
}
export interface IreferralDetails {
    Bhk: number;
    BrokerAssinged: string;
    BrokerAssingedId: number;
    Budget: number;
    CreatedOn: Date;
    CrmAssinged: string;
    Email: string;
    Face2Face: number;
    IncentivePraposed: number;
    MobileNo: string;
    Name: string;
    NoOfSiteVisit: number;
    Possession: string;
    PreferredCity: string;
    PreferredDate: Date;
    PreferredLocation: string;
    PreferredProject: string;
    PreferredTime: number;
    ReferralBy: string;
    ReferralId: number;
    ReferralStatus: string;
    SalesAgentAssinged: string;
    Source: string;
    TReferralId: number;
    UserType: string;
    iSACTIVE: boolean;
}
export interface IcpLeadDetails {
    ReferralId: number;
    Name: string;
    MobileNo: number;
    Email: string;
    ReferralStatus: string;
    BrokerAssingedId: number;
    BrokerAssinged: string;
}
