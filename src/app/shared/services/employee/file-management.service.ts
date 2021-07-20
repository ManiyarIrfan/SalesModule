import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  constructor(private http: HttpClient) { }

  getAllSmsNames = (user, selectedProject, Brochure, ContentType) => {
    let idBr = Brochure === 'false' ? true : false
    const url = `${environment.empApiUrl}api/Employees/GetBroucherByProjectName/UserId,UserType,EntityId,ProjectName,IsBrochure,ContentType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProject}&IsBrochure=${idBr}&ContentType=${ContentType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetBrochureNameList = (user, selectedProject, Brochure) => {
    const url = `${environment.empApiUrl}api/Employees/GetBroucherByProjectName/UserId,UserType,EntityId,ProjectName,IsBrochure,ContentType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProject}&IsBrochure=${Brochure}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelected = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertPdfFile = (projectName, fileManagementModel, ContentType, uploadPdfFileList, user,Input) => {
    let data = {
      employeeAdminTemplateParameter: {
        Id: user.UserId,
        TenantId: user.TenantId,
        ProjectName: projectName,
        Template: fileManagementModel.TemplateModel,
        key: fileManagementModel.TemplateName,
        Module: fileManagementModel.Module,
        Input: Input,
        contentType: ContentType
      },
      file: uploadPdfFileList
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/EmployeeProjectsPdfUpload/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  UpdateSMSTemplateContent = (user, Key_Id, Content, is_Active) => {
    let data = {
      keyId: Key_Id,
      content: Content,
      id: user.UserId,
      isActive: is_Active
    }
    let url = `${environment.empApiUrl}/api/EmployeeAdmin/EmployeeSMSContentUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

  deleteBrochure = (user, Key_Id, is_Active, fileUrl) => {
    let data = {
      brochureDelete: {
        id: user.UserId,
        fileId: Key_Id,
        isActive: is_Active
      },
      deleteFileUrl: fileUrl,
    }
    let url = `${environment.empApiUrl}/api/EmployeeAdmin/BrochureDelete/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

}
