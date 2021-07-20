export interface IfilterReferalStatus {
    ReferralId: string,
    Name: string,
    ReferralStatus: string,
    Source: string
}

export interface IleadinfoDetails {
    Source: string;
    SalesAgentAssignedId: string;
    ReferralStatus: string;
    ProjectVisited: string;
    StatusChangeReason: string;
    PresalesAgentAssigned: string;
    remarks: string;
    followUp: string;
    name: string;
    FollowUpDate: Date;
    FollowUp: string;
    FollowUpStatus: string;
    Agenda: string;
    FollowUpType: string;
    AlternateNo: string;
    followUpType: string;
    FollowUPTime: string;
}
export interface IinteractionModel {
    Details: string;
    interactiontype: string;
    followUp: string;
}
export interface IsiteVisitModel {
    PreferredProject: string;
    preDate: Date;
    PreferredTime: Date;
    Details: string;
}
export interface IleadDetailsModal {
    TReferralId: number;
    Name: string;
}