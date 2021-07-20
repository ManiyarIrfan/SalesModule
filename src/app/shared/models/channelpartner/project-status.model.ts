export interface IfilterDataModel {
    Result: string,
    FlatNo: string,
    BuildingType: string,
    Available: string,
    Floor: string,
    FlatView: string,
    LayoutType: string,
    ReraArea: string,
    Counter: string,
    FlatBlockByName: string,
    BHK: string,
    PreferredProject: string,
}
export interface IbuildingDetailModel {
    BuildingType: string;
    Result: string;
    FlatNo: number;
}
export interface IlistofbuildType {
    CurrentStatus: string;
    EstimationCompletionDates: Date;
    PlannedActivity: string;
    ReraArea: string;
    BuildingType: string;
    length: number;

}
export interface IlistedProjects {
    Result: string;
    Floor: string;
    LayoutType: string;
    ReraArea: number;
    Rate: number;
    TotalCost: number;
    FlatNo: number;
    Available: number;
    BHK: number;
}
export interface IchannelpartnerSearchModel {
    preferredLocation: string;
    preferredProjects: string;
    preferredBHK: string;
}
export interface IpreferredLocationLists {
    Location: string;
    TenantId: number;
    length: number;
    preferredLocation: string;
}
export interface IpreferredProjectLists {
    ProjectId: number;
    ProjectName: string;
    TenantId: number;
    length: number;
}
export interface IpreferredBHKLists {
    BHK: number;
    length: number;
}
export interface IbuildingDetailCountModel {
    Available: string;
    BHK: number;
    BuildingType: string
    Counter: number;
    FlatBlockBy: string;
    FlatBlockByName: string;
    FlatBlockedOn: string;
    FlatNo: number;
    FlatView: string;
    Floor: number;
    LayoutType: number;
    ProjectId: number;
    ProjectName: string;
    Rate: number;
    ReraArea: number;
    Result: number;
    TotalCost: number;
}
export interface IselectedBrochureNames {
    CreatedOn: Date;
    Id: number;
    IsActive: boolean;
    ProjectName: string;
    UpdatedOn: Date;
    length: number;
}
export interface IprojectInfo {
    Available: string;
    BHK: number;
    BuildingType: string;
    Counter: number;
    FlatBlockBy: number;
    FlatBlockByName: string;
    FlatBlockedOn: number;
    FlatNo: string;
    FlatView: string;
    Floor: number;
    LayoutType: string;
    ProjectId: number;
    ProjectName: string;
    Rate: number;
    ReraArea: number;
    Result: number;
    TotalCost: number;
}