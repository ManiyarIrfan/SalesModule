export interface IcreateReceiptModel {
    OrderId: string;
    PSId: number;
    ReceiptDate: string;
    PayBy: string;
    BankName: string;
    Branch: string;
    ChequeDate: string;
    ChequeNumber: string;
    PaidAgainstDue: string;
    ServiceTax: string;
    InfraCharges: number;
    TotalInfraReceiptAmount: number;
    LegalName: string;
    address: string;
    Remark: string;
    TotalDemandRaised: number;
    TotalAmountwithoutGSTInfra: number;
    TaxReceived: number;
    TotalGstReceiptAmount: number;
    InstallmentNo: number;
    ReceiptNo: number;
    ImageUrl: string;
    PayAgainst1: string;
    Infra: string;
    Psidcount: number;
    AdvanceInfraPaidAmount: number;
    AdvanceGSTPaidAmount: number;
    remainingGSTAmount: number;
    remainingInfraAmount: number;
    AdvancePaidAgainstDuePaid: number;
    remainingRaisedAmount: number;
    AdvancePayment: number;
    AdvanceDemandPaid: number;

}
export interface IstoreDetails {
    CustomerName: string;
    ProjectId: number;
}