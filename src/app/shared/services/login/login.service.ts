import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  LoginDetails = (loginModel) => {
    let data = {
      UserId: loginModel.email ? loginModel.email : null,
      Password: loginModel.Password ? loginModel.Password : null,
      LoggedInURL: loginModel.loggedInUrl ? loginModel.loggedInUrl : null,
      deviceProperties: loginModel.deviceDetails ? loginModel.deviceDetails : null,
      Provider: loginModel.Provider ? loginModel.Provider : null
    }
    return this.http.post(`${environment.apiUrl}api/Login`, data).pipe(map(x => x), take(1));
  }
  getVersion() {
    const url = `${environment.salesURL}assets/version.json`;
    return this.http.get(url).pipe(map(x => x));
  }
  getNumber = (term) => {
    const url = `${environment.apiUrl}api/Password/ForgotPassword/GetNumberByEmailorNumber/Search?Search=${term}`;
    return this.http.get(url).pipe(map(x => x));
  }
  updatePassword = (loginModel) => {
    let data = {
      search: loginModel.Search,
      newpassword: loginModel.NewPassword
    }
    let url = `${environment.apiUrl}api/Password/UpdateForgotPassword/Search?UserId=${loginModel.Search}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  getpasswordupdate = (changePasswordModel, user) => {
    let data = {
      UserId: user.UserEmail,
      UserType: user.UserType,
      EntityId: user.EntityId,
      pwd: changePasswordModel.oldPwd,
      newpwd: changePasswordModel.NewPwd
    }
    let url = `${environment.apiUrl}api/Password/ChangePassword/UserId,UserType,EntityId?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  profilePicUpdate = (user, uploadImage) => {
    let data = {
      insertUpdateProfilePicModel: {
        entityId: user['EntityId'] ? user['EntityId'] : null,
        userType: user['UserType'] ? user['UserType'] : null,
        id: user['UserId'] ? user['UserId'] : null,
      },
      files: uploadImage
    }
    let url = `${environment.apiUrl}api/ProfilePicUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  // get client System Related Information
  getIp = () => {
    return this.http.get('https://json.geoiplookup.io?')
      .pipe(map(x => x));
  }
  registerNewUser = (userDetails) => {
    let data = {
      FirstName: userDetails.FirstName || null,
      LastName: userDetails.LastName || null,
      Pwd: userDetails.Pwd || null,
      Email: userDetails.Email || null,
      MobileNo: userDetails.MobileNo || null,
      Provider: userDetails.Provider || null,
      UserType: userDetails.UserType || null,
      ProfilePic: userDetails.ProfilePic || null,
      IdToken: userDetails.idToken || null,
    }
    let url = `${environment.apiUrl}api/AddSocialUserRegistration`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  logoutDetails = (user, Input) => {
    let data = {
      id: user.UserId,
      userType: user.UserType,
      entityId: user.EntityId,
      input: Input,
    }
    let url = `${environment.apiUrl}api/InsertUpdateLogInLogOutDetails`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  sendEmailService = (Email) => {
    let data = {
      Search: Email
    }
    let url = `${environment.apiUrl}api/EmailforPasswordRecoverywithPassword`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
}
