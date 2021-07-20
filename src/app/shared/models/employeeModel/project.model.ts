export interface IstoreData {
    ProjectName: string;
    ProjectId: number;
}
export interface IprojectInsertModal {
    ProjectName: string;
    ProjectType: string;
    Rate: number;
    AvgRate: number;
    ReraApproval: string;
    ReraRegistrationNo: number;
    TotalBuilding: number;
    NoOfFlat: number;
    Address1: string;
    Address2: string;
    Landmark: string;
    Location: string;
    City: string;
    State: string;
    Country: string;
    PinCode: number;
    Dnd: string;
    Phase2: string;
}
export interface IpaymentInsertModal {
    ProjectName: string;
    MilestoneName: string;
    Percentage: number;
    Details: string;

}
export interface IprojectModal {
    ProjectName: string;
    ProjectType: string;
    Rate: number;
    AvgRate: number;
    ReraApproval: string;
    ReraRegistrationNo: number;
    TotalBuilding: number;
    NoOfFlat: number;
    Address1: string;
    Address2: string;
    Landmark: string;
    Location: string;
    City: string;
    State: string;
    Country: string;
    PinCode: number;
    Dnd: string;
    Phase2: string;
    ProjectId: number;
    TenantId: number;
}