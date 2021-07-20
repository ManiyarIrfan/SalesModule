import { string } from '@amcharts/amcharts4/core';

export interface IrefModel {
    custType: string;
    refOccupation: string;
    requireType: string;
    budget: string;
    preCity: string;
    PreferredArea: string;
    PreferredProject: string;
    comm_options: string;
    it_options: string;
    bhk: string;
    preDate: Date;
    refFirst: string;
    refLast: string;
    refMobileNo: number;
    refLandline: number;
    refEmail: string;
    refCity: string;
    refAddress1: string;
    Possession: string;
    visitSite: string;
}
export interface IPreferredProjectInfo {
    ProjectId: number;
    ProjectName: string;
}
export interface IPreferredAreaInfo {
    Location: string;
}