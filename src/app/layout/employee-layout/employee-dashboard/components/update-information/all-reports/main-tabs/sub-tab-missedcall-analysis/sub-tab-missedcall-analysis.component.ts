import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';

@Component({
  selector: 'tru-sub-tab-missedcall-analysis',
  templateUrl: './sub-tab-missedcall-analysis.component.html',
  styleUrls: ['./sub-tab-missedcall-analysis.component.scss']
})
export class SubTabMissedcallAnalysisComponent implements OnInit {
  @Input() dateObj: any;
  public selectedDateRange: any;
  public loggedInuserDetails: any;
  public getMissedCallData = [];
  public directionvalue: string = "";
  public isLoading: boolean = true;
  public getmissedCallDetailsSubscription: Subscription;
  constructor(private router: Router, private excelService: ExcelService, private empService: EmpReportService) { }

  public Direction: any = [
    { key: 'select', value: '--- Select Type ---' },
    { key: '', value: 'All' },
    { key: 'outbound-api', value: 'Outgoing' },
    { key: 'incoming', value: 'Incoming' }
  ];

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.directionvalue = 'select';
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //-----if date range change-----//
    if (changes && this.dateObj) {
      this.selectedDateRange = this.dateObj;
      if (this.loggedInuserDetails && this.loggedInuserDetails !== '') {
        this.getMissedCallAnalysis(this.directionvalue);
      }
    }
    //-----End-----//
  }

  //--------------Get Details of Total Calls by Direction or All and Missed Calls among those total calls---------------
  getMissedCallAnalysis = (directionvalue) => {
    this.isLoading = true;
    if (directionvalue !== 'select') {
      this.getmissedCallDetailsSubscription = this.empService.getmissedCallDetails(this.loggedInuserDetails, this.directionvalue, this.selectedDateRange).subscribe((response) => {
        this.getMissedCallData = (response && response['data'] && response['data'].length > 0) ? response['data'] : [];
        this.isLoading = false;
      });
    } else {
      this.getMissedCallData = [];
      this.isLoading = false;
    }    
  }

  exportEvent() {
    //---this export the details in excel file---//
    if (this.getMissedCallData && this.getMissedCallData !== []) {
      this.excelService.exportAsExcelFile(this.getMissedCallData, 'ExcelSheet');
    }
    //---end---//
  }

  //----------------Destroy subscription of get missed call detail service-----------//
  ngOnDestroy() {
    this.getmissedCallDetailsSubscription ? this.getmissedCallDetailsSubscription.unsubscribe() : null;
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

}
