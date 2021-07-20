import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';

@Component({
  selector: 'tru-sub-tab-one-day-call',
  templateUrl: './sub-tab-one-day-call.component.html',
  styleUrls: ['./sub-tab-one-day-call.component.scss']
})
export class SubTabOneDayCallComponent implements OnInit {
  public selectedDateRange: any;
  public loggedInuserDetails: any;
  public CurrenDate: Date;
  public yesterdayDate: string;
  public isLoading: boolean = false;
  public getCallData = [];
  public TodaysDate: string = '';
  public getFirstLastCallSubscription: Subscription;
  constructor(private router: Router, private excelService: ExcelService, private empService: EmpReportService) { }

  ngOnInit() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    this.TodaysDate = (yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd));
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    }
  }

  //--------------Get Details of Total Calls by Direction or All and Missed Calls among those total calls---------------
  getOneDayCallAnalysis = (CurrenDate) => {
    this.isLoading = true;
    this.getFirstLastCallSubscription = this.empService.getFirstLastCall(this.loggedInuserDetails, this.CurrenDate).subscribe((response) => {
      this.getCallData = (response && response['data'] && response['data'].length > 0) ? response['data'] : [];
      this.isLoading = false;
    });
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  // Unsubscribe service
  ngOnDestroy() {
    this.getFirstLastCallSubscription ? this.getFirstLastCallSubscription.unsubscribe() : null;
  }
}
