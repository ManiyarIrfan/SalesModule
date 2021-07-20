export interface IcpDetail {
    CPId: number;
    CPName: string;
    Organization: string;
    MobileNo: number;
    CreatedOn: Date;
    NumOfReferral: number;
    SiteVisite: string;
    Booking: string;
    Name: string;
    Template: string;
    EntityId: number;
    AlternateNo: number;
    Email: string;
}
export interface IfollowUpDetails {
    FollowUpDate: Date;
    FollowUpStatus: string;
    followUpType: string;
    Details: string;
    followUp: string;
}
export interface ImessageModel {
    Template: string;
}