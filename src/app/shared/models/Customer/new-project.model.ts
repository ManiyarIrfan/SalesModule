export interface IgetarchitectData
{
    filename:string;
    Portfolio:string;
    Document:string;
}
export interface IselectedList
{
    WaterStorage:string;
    Parking:string;
    BHK:string;
}

export interface IamenityDetails 
{
    Amenity:string;
   AmenityId:number;
    SiteId:number;
    SiteName: string;  
}
export interface IareaDetails
{
 Area:number;
AreaId:number;
SiteId:number;
SiteName: string;
}
export interface IspecificationModel
 {
    Description: string,
    Area: number,
    BHK: number,
    Budget: number,
    CarParking: number
}
export interface IsiteDetailsList
{
Amenities: string;
BHK:number;
City:string;
CityId:number;
Country:string;
CountryId: number;
CreatedOn: "2019-05-10T11:07:33.6"
DNDStage:string;
Description:string;
Developer:string;
FileNames:string;
Files:string;
LandArea: "10 x 25 mtr"
LegalEntityId:number;
Location:string;
PropertyAddress: string;
SiteId:number;
SiteName:string;
State:string;
StateId: number;
}
export interface IdesignBriefModel
{
    BHK:number;
    Parking:string;
    WaterStorage:string;
    Description:string;
    OptIn:boolean;
    
}
export interface IsiteDetails
{
    SubProject:string;
    FlatNo:number;
    SiteName:string;
    ProjectName:string;
    SiteId:number;
}
export interface Iconstraintlist
{
    ContourLevel:number;
    Direction:string;
    FSI:number;
    FloorAllowed:number;
    FrontMargin:number;
    FrontRoadWidth:number;
    MaxHeightOfUnit:number;
    MaxPlinthArea:number;
    PlanType:string;
    PlinthLevel:number;
    PlotArea:number;
    PlotLength:number;
    PlotWidth:number;
    RearMargin:number;
    RearRoadWidth:number;
    Remark:string;
    RoadLevel:number;
    Sector:string;
    SideMargin:number;
    UGT:number;
}
export interface IgetAllInteractions
{
    VendorName:string;
    Details:string;
    InteractionType:string;
    CreatorName:string;
    ArchitectName:string;
}
export interface IarchitectProjDetails
{
    VendorName:string;
}
export interface IInteractionModel
{
    Details:string;
}