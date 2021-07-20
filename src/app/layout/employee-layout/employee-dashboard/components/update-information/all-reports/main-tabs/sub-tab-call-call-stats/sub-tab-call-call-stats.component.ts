import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'tru-sub-tab-call-call-stats',
  templateUrl: './sub-tab-call-call-stats.component.html',
  styleUrls: ['./sub-tab-call-call-stats.component.scss']
})
export class SubTabCallCallStatsComponent implements OnInit {
  //Declare Variable
  @Input() dateObj :any;// Get date for Passing it to another component
  public chartValues: any;
  public SelectedDateRange: any;
  public loggedInuserDetails:any
  public enquiryStatus:any=[
    { key: "Sales", value: "Sales"},
    { key: "Team", value: "Team" }
  ];
  constructor(public router: Router) { } 
  ngOnInit() {
  }
}