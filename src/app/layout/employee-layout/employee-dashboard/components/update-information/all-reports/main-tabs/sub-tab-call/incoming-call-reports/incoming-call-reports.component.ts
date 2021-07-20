import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tru-incoming-call-reports',
  templateUrl: './incoming-call-reports.component.html',
  styleUrls: ['./incoming-call-reports.component.scss']
})
export class IncomingCallReportsComponent implements OnInit ,OnChanges{
  // Declare Variables
  @Input() key: any;// get Key for Getting Report related to key
  @Input() dateObj :any; // get Date for passing input to other component
  // private keyValue: any;
  public SelectedDateRange: any;
  public loggedInuserDetails:any;
  constructor(public router: Router) { }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
//************* On date change get Report data **************//
    if(changes && this.dateObj){
      this.SelectedDateRange=this.dateObj;
    }
  }
//************* End **************//
}
