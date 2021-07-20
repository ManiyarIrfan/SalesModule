import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NewProjectsService {

  constructor(private http: HttpClient) { }

  getSiteDetails = (user, siteId, Input) => {
    const url = `${environment.executionApiUrl}api/SiteMaster/GetSiteDetails/UserId,EntityId,UserType,SiteId,Input?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&SiteId=${siteId}&Input=${Input}`;
    return this.http.get(url).pipe(map(x => x));
  }

  getArchitectList = (user, subprojectDetails) => {
    let data = {
      siteId: subprojectDetails.SiteId ? subprojectDetails.SiteId : null,
      subProjectId: subprojectDetails.SubProjectId ? subprojectDetails.SubProjectId : null,
      status: subprojectDetails.Status ? subprojectDetails.Status : null,
      input: subprojectDetails.Action ? subprojectDetails.Action : null,
      entityId: user.EntityId,
      userType: user.UserType
    }
    let url = `${environment.executionApiUrl}api/ExternalTaskExecution/ExternalTaskExecutionSelect/UserId,EntityId,UserType,SiteId,VendorType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  getSelectedArchitect = (user, subProjectDetails) => {
    const url = `${environment.executionApiUrl}api/ExternalTaskExecution/CustomerSelectionSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&SiteId=${subProjectDetails.SiteId}&SubProjectId=${subProjectDetails.SubProjectId ? subProjectDetails.SubProjectId : null}`;
    return this.http.get(url).pipe(map(x => x));
  }

  selectedArchitect = (user, architectDetails) => {
    let data = {
      etExecutionId: architectDetails.etExecutionId ? architectDetails.etExecutionId : null,
      entityId: user.EntityId,
      userType: user.UserType,
      id: user.UserId,
      siteId: architectDetails.SiteId ? architectDetails.SiteId : null,
      subProjectId: architectDetails.SubProjectId ? architectDetails.SubProjectId : null,
      vendorId: architectDetails.VendorId ? architectDetails.VendorId : null,
      vendorType: architectDetails.VendorType ? architectDetails.VendorType : null
    }
    let url = `${environment.executionApiUrl}api/ExternalTaskExecution/CustomerSelectionInsertUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  getSpecificationOption = (user, siteDetail, Input) => {
    const url = `${environment.executionApiUrl}api/SiteMaster/GetSiteDetails/UserId,EntityId,UserType,SiteId,Input?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&SiteId=${siteDetail.SiteId}&SubProjectId=${siteDetail.SubProjectId}&Input=${Input}`;
    return this.http.get(url).pipe(map(x => x));
  }
  customerSpecification = (user, specificationModel, Input) => {
    let data = {
      entityId: user.EntityId,
      userType: user.UserType,
      id: user.UserId,
      siteId: specificationModel.SiteId ? specificationModel.SiteId : null,
      bhk: specificationModel.BHK ? specificationModel.BHK : null,
      budget: specificationModel.Budget ? specificationModel.Budget : null,
      area: specificationModel.Area ? specificationModel.Area : null,
      amenities: specificationModel.AmenityId ? specificationModel.AmenityId : null,
      carParking: specificationModel.CarParking ? specificationModel.CarParking : null,
      description: specificationModel.Description ? specificationModel.Description : null,
      subProjectId: specificationModel.SubProjectId ? specificationModel.SubProjectId : null,
      cpSubId: specificationModel.CpSubId ? specificationModel.CpSubId : null,
      optIn: specificationModel.OptIn ? specificationModel.OptIn : null,
      Input
    }
    let url = `${environment.executionApiUrl}api/ExternalTaskExecution/CustomerPreferenceInsertUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  ratingMasterInsert = (user, ratingDetails) => {
    let data = {
      processId: ratingDetails.SVersionId ? ratingDetails.SVersionId : null,
      processType: ratingDetails.RatingType ? ratingDetails.RatingType : null,
      subProcessType: ratingDetails.SubRatingType ? ratingDetails.SubRatingType : null,
      entityId: ratingDetails.VendorId ? ratingDetails.VendorId : null,
      userType: ratingDetails.VendorType ? ratingDetails.VendorType : null,
      enteredById: user.EntityId,
      enteredByType: user.UserType,
      isActive: ratingDetails.IsActive ? ratingDetails.IsActive : null,
      rating: ratingDetails.Rating ? ratingDetails.Rating : null,
      feedback: ratingDetails.Feedback ? ratingDetails.Feedback : null,
      siteId: ratingDetails.SiteId ? ratingDetails.SiteId : null,
      subProjectId: ratingDetails.SubProjectId ? ratingDetails.SubProjectId : null,
      id: user.UserId + "-" + user.Firstname + " " + user.LastName,
      input: ratingDetails.Input,
      ratingId: ratingDetails.RatingId ? ratingDetails.RatingId : null
    }
    const url = `${environment.executionApiUrl}api/Master/RatingMasterInsert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  getOrder = (user) => {
    const url = `${environment.apiUrl}api/PaymentSchedule/GetById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  filelistOnSite = (user, siteDetails, input) => {
    let data = {
      id: user.UserId,
      siteId: siteDetails.SiteId ? siteDetails.SiteId : null,
      SubProject: siteDetails.SubProject ? siteDetails.SubProject : null,
      input
    }
    let url = `${environment.executionApiUrl}api/SelectionProcess/SelectionProcessSelect/UserId,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  InsertInteraction = (user, interactionDetails, siteDetail) => {
    let data = {
      Id: user.UserId,
      EntityId: siteDetail.VendorId ? siteDetail.VendorId : null,
      UserType: siteDetail.VendorType ? siteDetail.VendorType : null,
      Details: interactionDetails.Details ? interactionDetails.Details : null,
      InteractionType: interactionDetails.Input ? interactionDetails.Input : null,
      SubProjectId: siteDetail.SubProjectId ? siteDetail.SubProjectId : null,
      SiteId: siteDetail.SiteId ? siteDetail.SiteId : null,
      CreatorUserType: user.UserType,
      creatorId: user.EntityId,
      enteredById: user.EntityId ? user.EntityId : null,
      enteredByType: user.UserType ? user.UserType : null,
      toReplyId: null
    }
    const url = `${environment.executionApiUrl}api/Master/InteractionInsert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  getNotesDetails = (user, siteDetail) => {
    let data = {
      EntityId: siteDetail.VendorId ? siteDetail.VendorId : null,
      UserType: siteDetail.VendorType ? siteDetail.VendorType : null,
      CreatorId: user.EntityId,
      CreatorUserType: user.UserType,
      Input: siteDetail.Input,
      SubProjectId: siteDetail.SubProjectId ? siteDetail.SubProjectId : null,
      SiteId: siteDetail.SiteId ? siteDetail.SiteId : null,
    }
    const url = `${environment.executionApiUrl}api/Master/InteractionSelect/UserId,EntityId,UserType`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  getDesignBriefData = (user, Input) => {
    const url = `${environment.executionApiUrl}api/Master/CustomerPreferenceMasterSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Input=${Input}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getSelectedPrefrences = (user, Input, SiteId, SubProjectId) => {
    const url = `${environment.executionApiUrl}api/ExternalTaskExecution/CustomerPreferenceSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Input=${Input}&SiteId=${SiteId}&SubProjectId=${SubProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getkeyHighlightList = (user, input) => {
    const url = `${environment.executionApiUrl}api/Master/GetCheckListByType/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&CheckListType=${input}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
