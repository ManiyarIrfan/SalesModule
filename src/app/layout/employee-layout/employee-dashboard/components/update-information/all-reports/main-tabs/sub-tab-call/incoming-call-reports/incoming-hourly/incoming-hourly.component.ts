import { Component, OnInit, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tru-incoming-hourly',
  templateUrl: './incoming-hourly.component.html',
  styleUrls: ['./incoming-hourly.component.scss']
})
export class IncomingHourlyComponent implements OnInit, OnDestroy {
  public isBarChartLoading: boolean = true;
  public ChartValues: any;
  public loggedInuserDetails: any;
  public SelectedDateRange: any;
  public getDetailsSubscription: Subscription;

  @Input() dateObj: any;// get Date for Getting Report data

  constructor(
    public router: Router,
    private empReportService: EmpReportService) { }

  ngOnInit() {
    //************* Login Authorization **************//
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getDetails();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
  getDetails = () => {
    //************* Get response from API **************//
    this.getDetailsSubscription = this.empReportService.GetCallReportDetails(this.loggedInuserDetails, this.SelectedDateRange, 'Incoming', 'Hourly', null, null).subscribe((response) => {
      if (response && response['data']) {
        this.ChartValues = this.PreparedgraphObject(response['data'][1], 'IncomingHourly', 'Hour');
        this.isBarChartLoading = false;
      }
    });
  }
  PreparedgraphObject = (response, chartId, name) => {
    //************* Convert Response into Result required for Chart **************//
    if (response) {
      return { id: chartId, response: response, value: ["Completed", "Incomplete"], name: name };
    }
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

  ngOnDestroy() {
    this.getDetailsSubscription ? this.getDetailsSubscription.unsubscribe() : null;
  }
}
