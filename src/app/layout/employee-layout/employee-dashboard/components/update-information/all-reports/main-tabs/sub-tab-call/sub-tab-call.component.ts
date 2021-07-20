import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tru-sub-tab-call',
  templateUrl: './sub-tab-call.component.html',
  styleUrls: ['./sub-tab-call.component.scss']
})
export class SubTabCallComponent implements OnInit ,OnChanges{
  //Declare variable
  @Input() dateObj :any;// Get date for passing to another Component
  public chartValues: any;
  public reportingName: string = "IncomingCall";
  public SelectedDateRange: any;
  public loggedInuserDetails:any
  public Subreport:any=[
    { key: "Daily", value: "Daily"},
    { key: "Hourly", value: "Hourly" }
  ];
  constructor(public router: Router) { }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes && this.dateObj){      
    }
  }
}
