import { ThemePalette } from '@angular/material';

export interface INewDiscussionModel {
    ProjectId: number,
    SubProjectId: number,
    Subject: string,
    FileType: string,
    Message: string,
    Attachments: string
}

export interface ICurrentSelectedDiscussion {
    Discussion: string,
    Subject: string,
    Comment: string,
    Comments: string,
    Views: number,
    Likes: number,
    Dislikes: number,
    CreatedOn: string,
    Message: string,
    UserName: string,
    Attachments: string,
    ProfilePic: string,
    Replay: boolean,
    Timeelapsed: string
}

export interface IUserProfileModel {
    Firstname: string,
    UserId: string,
    LastName: string,
    UserEmail: string,
    MobileNo: string,
}

export interface IChatModel {
    Message: string,
    SendMessage: string,
    ProfilePic: string,
    FirstName: string,
    LastName: string,
    //  SendToId: number
    SendToUserId: string,
    SendByUserId: string,
    //  SendById: number,
    // SendToUserType: string
    UserName: string
    Input: string
}

export interface INewGroupModel {
    GroupName: string,
    GroupProfilePic: string,
    RecipientsId: string[],
    CreatorUserId: string,
    SearchRecipients: string,
    ProjectId: number,
    Input: number,
    DisableDocTypeFlag: boolean
}

export interface ChipColor {
    name: string;
    color: ThemePalette;
}