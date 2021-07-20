export interface IProjectStatusModel {
    ProjectName: string;
    BuildingType: string;
    CurrentStatus: string;
    EstimationCompletionDates: Date;
    CurrentPrice: number;
    PriceRevision: number;
    ProjectId: number;
    PlannedActivity: string;
    exeSubProject: string;
    dndSubProject: string;
}
export interface IlinkProjectModel {
    exeSubProject: string;
    dndSubProject: string;
}