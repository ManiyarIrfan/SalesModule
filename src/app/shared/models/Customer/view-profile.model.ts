import { string } from '@amcharts/amcharts4/core'

export interface IprojectFlatDetails {
    AgreementFile: string;
    BHK: number;
    BuildingType: string;
    Draft: string;
    EmployeeId: number;
    FlatNo: number;
    Latitude: number;
    Longitude: number;
    NOCFile: string;
    OrderId: number;
    ProjectId: number;
    ProjectName: string;
    SalesAgentId: number;
    FlatType: string;
}

export interface IcustModel {
    custProject: string;
    custBHK: number;
    custTower: string;
    custType: string;
    custFlat: number;
    Longitude: number;
    Latitude: number;
    Country:string;
    BankName:string;
    BankBranch:string;
    AccountNo:number;
}
export interface IlistedProjects {
    BuildingType: string;
    Floor: number;
    LayoutType: string;
    ReraArea: number;
    FlatNo: number;
    Available: number;
    BHK: number;
    length:number;
}
export interface IcustSearchModel {
    preferredLocation: string;
    preferredProjects :string;
    preferredBHK:string; 
}
export interface IpreferredLocationLists {
    Location: string;
    TenantId: number;
    length:number;
}
export interface IpreferredProjectLists {
    Location: string;
    ProjectName: string;
    length:number;

}
export interface IpreferredBHKLists {
    BHK: string;
    length:number;
}
export interface IcustModel {
    Name: string;
    CustomerId: number;
    Email: string;
    MobileNo: number;
    AlternateNo: number;
    Dob: Date;
    AddressLine1: string;
    City: string;
    State: string;
    custCountry: string;
    Pincode: number;
    Occupation: string;
    bankname: string;
    branchname: string;
    accno: number;
    IFSCCode: number;
    UPICode: number;
    PaymentLinkId: number;
    invoice_number: number;
}
export interface IflatDetails {
    AgreementFile: string;
    BHK: number;
    BuildingType: string;
    EmployeeId: number;
    FlatNo: number;
    Latitude: number;
    Longitude: number;
    NOCFile: string;
    OrderId: number;
    ProjectId: number;
    ProjectName: string;
    SalesAgentId: number;
    length:string;
}
export interface IgetFileURL
{
AgreementFile:string;
BHK: string;
BuildingType:string;
EmployeeId:number;
FlatNo:number;
Latitude:number;
Longitude:number;
NOCFile:string;
OrderId:number;
ProjectId:number;
ProjectName: string;
SalesAgentId:number;
Draft:string;
}