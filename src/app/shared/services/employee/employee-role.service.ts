import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoleService {

  constructor(private http: HttpClient) { }
  getEmployeeRole = () => {
    const url = '../../../../assets/employeeRole.json';
    return this.http.get(url).pipe(map(x => x));
  }
}
