export interface IprojectModel {
    ProjectName: string;
    buildingType: string;
}
export interface IprojDetailModel {
    PLC: string;
    FlatNo: string;
    ProjectName: string;
    buildingType: string;
    Floor: number;
    LayoutType: string;
    BHK: number;
    Available: string;
    ReraArea: string;
    Rate: number;
    CarpetArea: number;
    EnclosedBalcony: string;
    AttachedTerrace: string;
    ParkingSlot: number;
    ParkingCharge: number;
    InfraCharge: number;
    FloorRise: string;
    MonthlyMaintenance: number;
    FlatView: string;
    PlotArea_A: number;
    PlotArea_B: number;
    Remark: string;
    BGroundFloorCarpetArea: string;
    BFirstFloorCarpetArea: string;
    BSecondFloorCarpetArea: string;
    BBalconyCarpetArea: string;
    BSaleableCarpetArea: string;
    BTotalCarpetArea: string;
}