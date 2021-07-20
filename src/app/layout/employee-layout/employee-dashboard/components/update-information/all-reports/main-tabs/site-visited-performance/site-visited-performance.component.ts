import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'tru-site-visited-performance',
  templateUrl: './site-visited-performance.component.html',
  styleUrls: ['./site-visited-performance.component.scss']
})
export class SiteVisitedPerformanceComponent implements OnInit, OnChanges {
  @Input() dateObj: any;
  public loggedInuserDetails: any
  public enquiryStatus: any = [
    { key: "Sales", value: "Sales" },
    { key: "Team", value: "Team" },
  ];
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (changes && this.dateObj) { 
    // }
  }

}
