export interface IpaymentStatusModel {
    InVoiceNo: number;
    InvoiceDate: Date;
    PaymentMade: string;
    AmountCr: number;
    ChequeNo: number;
    DateOfCheque: Date;
    AmountDr: number;
}
export interface IsessionModel {
    OrderId: number;
}
export interface IshowData {
    City: string;
    Organization: string;
    Email: string;
    AlternateNumber: number;
    MobileNo: number;
    Name: string;
}
export interface Idetails {
    OrderId: number;
    Name: string;
    ProjectName: string;
    BuildingType: string;
    FlatNo: number;
    IncentiveValue: number;
}