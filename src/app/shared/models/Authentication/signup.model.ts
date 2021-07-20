export interface IRegistrationModel {
    FirstName: string;
    LastName: string;
    MobileNo: string;
    FileURL: string;
    EventName: string;
    Body: string;
    Subject: string;
    EmailId: string;
    EventType: string;
    Type: string;
    Remark?: string;
    Input: string;
    DisableBtn?: boolean;
    HideShowBtn?: boolean;
    hideNewEvent: boolean;
    hidePreviousEvent: boolean;
    hideUpcomingEvent: boolean;
    HideShowRegister: boolean;
    HideShowAll: boolean;
    HideShowArrow1: boolean;
    FirmNameFlag: boolean;
    FirmName: string;
}

export interface INewModel {
    MobileNo: string,
    Email: string,
    FirstName: string,
    LastName: string,
    UserType: string,
    Provider: string,
    Pwd: string,
    ProfilePic: string,
    idToken: string,
    OTP: number
    Success: boolean;
    spinnerFlag: boolean;
}
