import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { take, map } from 'rxjs/operators';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  constructor(private _http: HttpClient) { }

  addNewDiscussion = (user, discussionData, inputFiles) => {
    const data = {
      discussionModelInsert: {
        ProjectId: Number(discussionData.ProjectId) || null,
        Subject: discussionData.Subject || null,
        Message: discussionData.Message || null,
        Attachments: discussionData.Attachments || null,
        EntityId: user.EntityId || null,
        UserType: user.UserType || null,
        UserId: user.UserId || null,
        Input: discussionData.Input || null,
        DiscussionId: discussionData.DiscussionId || null,
        Discussion: discussionData.Discussion || null,
        ParentId: Number(discussionData.ParentId) || null,
        ChildId: discussionData.ChildId || null,
        isPinned: discussionData.IsPinned,
      },
      UploadedFiles: inputFiles
    };
    const url = `${environment.apiUrl}api/community/Discussion_Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this._http.post(url, data).pipe(map(x => x), take(1));
  }

  getDiscussions = (data) => {
    const url = `${environment.apiUrl}api/community/Discussion_SearchAndSelect?Input=${data.Input}&DiscussionId=${data.DiscussionId}&EntityId=${data.EntityId}`;
    return this._http.get(url).pipe(map(c => c));
  }

  getProjects = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this._http.get(url).pipe(map(c => c));
  }

  insertInseraction = (user, Interactiondata) => {
    const body = {
      UserId: user.UserId || null,
      EntityId: user.EntityId || null,
      UserType: user.UserType || null,
      SendByUserId: user.UserId || null,
      SendToUserId: Interactiondata.SendToUserId || null,
      IsRead: Interactiondata.IsRead || null,
      InteractionType: Interactiondata.InteractionType || null,
      Message: Interactiondata.SendMessage || null,
      DiscussionId: Interactiondata.DiscussionId || null,
    }
    const url = `${environment.apiUrl}api/community/Interaction_Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this._http.post(url, body).pipe(map(c => c), take(1));
  }

  getInteractions = (user, data) => {
    const url = `${environment.apiUrl}api/community/Interaction_SearchAndSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&Input=${data.Input}&SendByUserId=${user.UserId}&SendToUserId=${data && data.SendToUserId ? data.SendToUserId : ''}`;
    return this._http.get(url).pipe(map(c => c));
  }

  getUserDetails = (user, Search) => {
    const url = `${environment.apiUrl}api/community/Search_Users/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Search=${Search}`;
    return this._http.get(url).pipe(map(c => c));
  }

  getGroups = (user, data) => {
    const url = `${environment.apiUrl}api/community/Groups_SearchAndSelect/UserId,EntityId,UserType?UserId=${user ? user.UserId : null}&EntityId=${user ? user.EntityId : null}&UserType=${user ? user.UserType : null}&Input=${data.Input}&GroupId=${data.GroupId}&UserProfileId=${user ? user.UserId : null}`;
    return this._http.get(url).pipe(map(c => c));
  }

  insertgroup = (user, gdata, ImageFile) => {
    const body = {
      groupsInsertModel: {
        ProjectId: gdata.ProjectId || null,
        CreatorUserId: user.UserId || null,
        GroupName: gdata.GroupName || null,
        GroupProfilePic: gdata.GroupProfilePic || null,
        RecipientsId: gdata.RecipientsId || null,
        EntityId: user.EntityId || null,
        UserType: user.UserType || null,
        Input: gdata.Input || null,
      },
      ProfilePic: ImageFile
    }
    const url = `${environment.apiUrl}api/community/Groups_Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this._http.post(url, body).pipe(map(c => c), take(1));
  }

  getFBPosts = (user, SearchModel) => {
    const url = `${environment.marketingApiUrl}api/Master/DocumentMaster_SearchAndSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Input=${SearchModel.Input}&DocType=${SearchModel.DocType}&DocId=${SearchModel.DocId}&StakeholderType=${SearchModel.StakeholderType}`;
    return this._http.get(url).pipe(map(x => x));
  };

  getNoficications = (user) => {
    const url = `${environment.apiUrl}api/community/GetNotifications/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this._http.get(url).pipe(map(x => x));
  };
}
