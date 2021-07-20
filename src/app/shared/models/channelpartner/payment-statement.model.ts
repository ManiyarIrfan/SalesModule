export interface Ishowstatement {
    AgreementStatus: string;
    BookingDate: Date;
    CustomerId: number;
    CustomerName: string;
    FlatNo: string;
    IncentiveProposed: number;
    IncentiveValue: number;
    Invoice: number;
    OrderId: number;
    OrderStatus: string;
    ProjectName: string;
    TotalValue: number;
    VerificationReason: string;
    VerificationStatus: string;
}
export interface cpOrderDetail {
    CustomerName: string;
    OrderId: string;
    BookingDate: Date;
    AgreementStatus: string;
    ProjectName: string;
    FlatNo: number;
    TotalValue: number;
    IncentiveProposed: number;
    IncentiveValue: number;
}