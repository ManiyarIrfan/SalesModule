import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tru-site-visit-sales',
  templateUrl: './site-visit-sales.component.html',
  styleUrls: ['./site-visit-sales.component.scss']
})
export class SiteVisitSalesComponent implements OnInit, OnChanges, OnDestroy {
  public notfound: boolean = false;
  public loggedInuserDetails: any;
  public salesChartValues: any;
  public SelectedDateRange: any;
  public isBarChartLoading: boolean = true;
  public getSiteVisitSalesSubscription: Subscription;

  @Input() dateObj: any;

  constructor(public router: Router, private empReportService: EmpReportService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getSiteVisitSales();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
  
  //*****get response of site visit by sales*********//
  getSiteVisitSales = () => {
    this.getSiteVisitSalesSubscription = this.empReportService.GetReportForSiteVisitSales(this.loggedInuserDetails, this.SelectedDateRange, 'SALES').subscribe((response) => {
      if (response && response['data'].length > 0) {
        this.salesChartValues = this.PreparedgraphObject(response['data'], 'sitevisitsales', 'FirstName');
        this.notfound = false;
      }
      else {
        this.notfound = true;
      }
      this.isBarChartLoading = false;
    });
  }
 
  //**********conver response into result requied for chart**********//
  PreparedgraphObject = (response, chartId, name) => {
    if (response) {
      let axisValue = Object.keys(response[0]);
      let index = axisValue.indexOf(name);
      if (index !== -1) {
        axisValue.splice(index, 2);
      }
      return { id: chartId, response: response, value: axisValue, name: name };
    }
  }
 
  //******get date on date chages********//
  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.dateObj) {
      this.SelectedDateRange = this.dateObj;
      if (this.loggedInuserDetails != null && this.loggedInuserDetails != undefined) {
        this.getSiteVisitSales();
      }
    }
  }

  ngOnDestroy() {
    this.getSiteVisitSalesSubscription ? this.getSiteVisitSalesSubscription.unsubscribe() : null;
  }
}
