import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  InsertFeedback = (user, Model) => {
    let data = {
      Id: user.UserId,
      Details: Model.Details ? Model.Details : null,
      EntityId: user.EntityId,
      UserType: user.UserType,
      ProjectId: 14,
      feedBackName: Model.feedBackName
    }
    const url = `${environment.empApiUrl}api/ProjectStatus/InsertFeedBack/UserId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  // Insert Customer Feedback Aminities Wise
  InsertCustomerFeedback = (user, CustDetails) => {
    const data = {
      Input: CustDetails.Input ? CustDetails.Input : null,
      ProjectId: CustDetails.ProjectId ? CustDetails.ProjectId : null,
      MapId: CustDetails.MapId ? CustDetails.MapId : null,
      Feedback: CustDetails.Feedback ? CustDetails.Feedback : null,
      Rating: CustDetails.Rating ? CustDetails.Rating : null,
      EntityId: user.EntityId,
      UserType: user.UserType,
      UserId: user.UserId,
    }
    const url = `${environment.apiUrl}api/Customer/CustomerFeedback_Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  // Get Customer Details 
  getCustomerDetails = (user) => {
    const url = `${environment.empApiUrl}api/Customer/GetAllCustomers/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  // Get Amenities Details  
  getAmenities = (user, SearchModel) => {
    const url = `${environment.apiUrl}api/Customer/CustomerFeedback_SearchAndSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectId=${SearchModel.ProjectId}&Input=${SearchModel.Input}&MapId=${SearchModel.MapId}`;
    return this.http.get(url).pipe(map(x => x));
  };
}
