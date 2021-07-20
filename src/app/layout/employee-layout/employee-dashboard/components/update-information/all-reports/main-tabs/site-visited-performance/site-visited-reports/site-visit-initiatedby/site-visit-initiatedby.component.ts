import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tru-site-visit-initiatedby',
  templateUrl: './site-visit-initiatedby.component.html',
  styleUrls: ['./site-visit-initiatedby.component.scss']
})
export class SiteVisitInitiatedbyComponent implements OnInit, OnChanges, OnDestroy {
  public notfound: boolean = false;
  public loggedInuserDetails: any;
  public salesChartValues: any;
  public SelectedDateRange: any;
  public isBarChartLoading: boolean = true;
  public getSiteVisitInitiatedBySubscription: Subscription;

  @Input() dateObj: any;

  constructor(
    public router: Router,
    private empReportService: EmpReportService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getSiteVisitInitiatedBy();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  //*****get date on date chages*********//
  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.dateObj) {
      this.SelectedDateRange = this.dateObj;
      if (this.loggedInuserDetails != null && this.loggedInuserDetails != undefined) {
        this.getSiteVisitInitiatedBy();
      }
    }
  }

  //*********Ge Report For Site Visit InitiatedBy*******//
  getSiteVisitInitiatedBy = () => {
    this.getSiteVisitInitiatedBySubscription = this.empReportService.GetReportForSiteVisitSales(this.loggedInuserDetails, this.SelectedDateRange, 'INITIATEDBY').subscribe((response) => {
      if (response && response['data'].length > 0) {
        this.salesChartValues = this.PreparedgraphObject(response['data'], 'sitevisitinitiate', 'LastName');
        this.isBarChartLoading = false;
      }
      else {
        this.notfound = true;
      }
      this.isBarChartLoading = false;
    });
  }


  //*********conver response into result requied for chart********//
  PreparedgraphObject = (response, chartId, name) => {
    if (response) {
      let axisValue = Object.keys(response[0]);
      let index = axisValue.indexOf(name);
      if (index !== -1) {
        axisValue.splice(index, 3);
      }
      return { id: chartId, response: response, value: axisValue, name: name };
    }
  }

  ngOnDestroy() {
    this.getSiteVisitInitiatedBySubscription ? this.getSiteVisitInitiatedBySubscription.unsubscribe() : null;
  }
}
