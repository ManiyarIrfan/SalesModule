import { string } from '@amcharts/amcharts4/core'

export interface IproModel {
    proName: string;
    currStatus: string;
    estiDate: Date;
    currPrice: number;
    planFlat: string;
    project: string;
}
export interface IplanFlat {
    BuildingType: string;
    CurrentPrice: number;
    CurrentStatus: number;
    EstimationCompletionDate: number;
    ImageUrl: string;
    PlannedActivity: string;
    ProjectName: string;
}
export interface IlistofbuildType {
    CurrentStatus: string;
    EstimationCompletionDates: Date;
    PlannedActivity: string;
    ReraArea: number;
    BuildingType: string;
    length: number;
}
export interface IchannelpartnerSearchModel {
    preferredLocation: string;
    preferredProjects: string;
    preferredBHK: string;
}
export interface IpreferredLocationLists {
    Location: string;
    length: number;
}
export interface IpreferredProjectLists {
    ProjectName: string;
    length: number;

}export interface IpreferredBHKLists {
    BHK: string;
    length: number;
}
export interface IprojectDetails {
    ProjectName: string;
    BuildingType: string;
    CurrentStatus: string;
    EstimationCompletionDate: Date;
    PlannedActivity: string;
    CurrentPrice: number;
}