import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tru-sales-perform-call-report',
  templateUrl: './sales-perform-call-report.component.html',
  styleUrls: ['./sales-perform-call-report.component.scss']
})
export class SalesPerformCallReportComponent implements OnInit, OnChanges {
  // Declare Variables
  @Input() key: any;// get Key for Getting Report related to key
  @Input() dateObj: any; // get Date for passing input to other component
  public keyValue: any;
  public SelectedDateRange: any;
  public loggedInuserDetails: any;
  constructor(public router: Router) { }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    //************* On date change get Report data **************//
    if (changes && this.dateObj) {
      this.SelectedDateRange = this.dateObj;
    }
  }
  //************* End **************//
}
