
export interface IIncentiveModel {
    Name: string;
    EmployeeName: string;
    LoginTime: string;
    LastLogoutTime: string;
    ScheduleDate: string;
    StartTime: string;
    EndTime: string;
    CreatedOn: Date;
    StdRate: number;
    Amount: number;
    IncentiveOn: number;
    IncentiveId: number;
    price: number;
    EffectiveStartDate: Date;
    EffectiveEndDate: Date;
}
export interface Icreateschedule {
    Presales: string;
    StartTime: string;
    EndTime: string;
}
export interface IsearchDPMModel {
    Presales: string;
}
