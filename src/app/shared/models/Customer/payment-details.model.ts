export interface IpaymentDetails {
    AmountBalance: number;
    BookingAmount: number;
    GstAmountBalance: number;
    GstAmountPaid: number;
    InfraAmountBalance: number;
    InfraAmountPaid: number;
    OrderId: number;
    TotalAgreedAmount: number;
    TotalAmountPaid: number;
    TotalDemandRaised: number;
    TotalGST: number;
    TotalGSTRaised: number;
    TotalInfra: number;
    TotalInfraRaised: number;
}
export interface ILeadDetails {
    BuildingType: string;
    CorrespondenceAddress: string;
    CustomerName: string
    Email: string;
    GST: number;
    InfraCharge: number;
    MobileNo: number;
    RegistrationTax: number;
    StampDuty: number;
    TDS: number;
    Tax: number;
    TotalAgreedAmount: number;
}
export interface IfinanceReciept {
    BookingAmount: number;
    BookingDate: number;
    FlatNo: number;
    JointName1: string;
    JointName2: string;
    OrderId: number;
    OrderStatus: string;
    ProjectName: string;
    ReferralName: string;
    RegistrationNo: number;
}
export interface ITotalValues {
    AllTotalAmount: number;
    TotalPercentage: number;
    AllTotalDemandRemaining: number;
    TotalAdvancePayment: number;
    TotalAmountReceived: number;
}
