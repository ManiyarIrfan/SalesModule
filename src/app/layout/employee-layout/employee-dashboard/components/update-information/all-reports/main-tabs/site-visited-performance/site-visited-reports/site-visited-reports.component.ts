import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'tru-site-visited-reports',
  templateUrl: './site-visited-reports.component.html',
  styleUrls: ['./site-visited-reports.component.scss']
})
export class SiteVisitedReportsComponent implements OnInit, OnChanges {
  public SelectedDateRange: any;
  public loggedInuserDetails: any;

  @Input() key: any;
  @Input() dateObj: any;
  constructor() { }

  ngOnInit() {
  }

  //----- get date when user chanes dates ------//
  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.dateObj) {
      this.SelectedDateRange = this.dateObj;
    }
  }
}
