export interface IUpdateCredentials {
    Remark: string;
    InvoiceRemark: string;
    OldUserId: string;
    NewUserId: string;
    confirmNewId: string;

}
export interface IlistreferredChannelPartner {
    Name: string;
    MobileNo: number;
    Email: string;
    CreatedOn: Date;
    Status: string;
    VerificationReason: string;
}
export interface Istore {
    Email: string;
}
export interface IsearchModel {
    Stakeholder: string;
}