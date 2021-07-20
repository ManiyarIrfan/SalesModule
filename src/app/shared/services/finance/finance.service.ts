import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(private http: HttpClient) { }

  uploadDoc = (user, modelData, filesModel) => {
    let body = {
      documentModelInsert: modelData,
      UploadedFiles: filesModel
    }
    let url = `${environment.apiUrl}api/finance/Documents_InsertUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, body).pipe(map(x => x), take(1));
  }

  getuploadDocs = (user,data) => {
    let url = `${environment.apiUrl}api/finance/Documents_SearchAndSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&DeviceDetails=${user.DeviceDetails}&Input=${data.Input}&DocumentId=${data.DocumentId}`;
    return this.http.get(url).pipe(map(x => x), take(1));
  }
}
