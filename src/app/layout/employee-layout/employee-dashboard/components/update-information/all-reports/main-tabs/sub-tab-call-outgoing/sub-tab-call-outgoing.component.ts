import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tru-sub-tab-call-outgoing',
  templateUrl: './sub-tab-call-outgoing.component.html',
  styleUrls: ['./sub-tab-call-outgoing.component.scss']
})
export class SubTabCallOutgoingComponent implements OnInit {
  //Declare variable
  @Input() dateObj :any;//Get date for passing as input to another component
  public chartValues: any;
  public SelectedDateRange: any;
  public loggedInuserDetails:any
  public enquiryStatus:any=[
    { key: "Daily", value: "Daily",template:"" },
    { key: "Hourly", value: "Hourly" }
  ];
  constructor(public router: Router) { } 
  ngOnInit() {
  }
}
