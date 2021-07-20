import { Component, OnInit, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tru-sales-perform-sales',
  templateUrl: './sales-perform-sales.component.html',
  styleUrls: ['./sales-perform-sales.component.scss']
})
export class SalesPerformSalesComponent implements OnInit, OnDestroy {
  public isLoading: boolean = true;
  public data: any[] = [];
  public heading: any;
  public totalvalue: any[] = [];
  public loggedInuserDetails: any;
  public SelectedDateRange: any;
  public notFound: boolean = false;
  public enabledButtonExport: boolean = false;
  public getDetailsSubscription: Subscription;

  @Input() dateObj: any;// get Date for Getting Report data

  constructor(
    public router: Router,
    private excelService: ExcelService,
    private empReportService: EmpReportService) { }

  ngOnInit() {
    //************* Login Authorization **************//
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getDetails();
    //************* End **************//
  }
  getDetails = () => {
    //************* Get response from API **************//
    this.getDetailsSubscription = this.empReportService.GetCallReportDetails(this.loggedInuserDetails, this.SelectedDateRange, 'Performance', 'Sales', '', '').subscribe((response) => {
      this.isLoading = false;
      if (response && response['data'] && response['data'][1].length > 0) {
        this.notFound = false;
        this.heading = Object.keys(response['data'][1]);
        this['data'] = response['data'][1];
        let avgtime;
        let length = 0;
        this['data'].forEach(element => {
          avgtime = ((element.Outgoing_Answered + element.Incoming_Answered) === 0) ? 0 : (element.Total_Talktime / (element.Outgoing_Answered + element.Incoming_Answered));
          element['AverageTalkTime'] = avgtime && avgtime.toFixed(2);
          if (Number(element["AverageTalkTime"]) && Number(element["AverageTalkTime"]) !== 0) {
            length++;
          }
        });
        this.totalvalue = response['data'][0];
        // = this['data'].length;
        this.totalvalue[0]['AverageTalkTime'] = this['data'].reduce((a, b) => +a + +b["AverageTalkTime"], 0) / length;
        this.enabledButtonExport = true;
      }
      else {
        this.notFound = true;
      }
    });
    //************* End **************//
  }
  ngOnChanges(changes: SimpleChanges) {
    //************* On date change get Report data **************//
    if (changes && this.dateObj) {
      this.SelectedDateRange = this.dateObj;
      if (this.loggedInuserDetails != null && this.loggedInuserDetails != undefined) {
        this.getDetails();
      }
    }
  }
  //************* End **************//
  exportEvent() {
    //*********  Export All Referral Details From Table *********//
    let AllCallsData = [];
    AllCallsData = this.data.concat(this.totalvalue);
    this.excelService.exportAsExcelFile(AllCallsData, 'ExcelSheet');
  }
  //********* End *********//

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy() {
    this.getDetailsSubscription ? this.getDetailsSubscription.unsubscribe() : null;
  }
}