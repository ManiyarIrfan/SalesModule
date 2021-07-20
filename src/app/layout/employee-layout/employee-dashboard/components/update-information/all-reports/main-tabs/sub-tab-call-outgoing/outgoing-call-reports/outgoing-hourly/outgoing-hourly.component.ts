import { Component, OnInit,  SimpleChanges, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
@Component({
  selector: 'tru-outgoing-hourly',
  templateUrl: './outgoing-hourly.component.html',
  styleUrls: ['./outgoing-hourly.component.scss']
})
export class OutgoingHourlyComponent implements OnInit {
  // Declare Variables
  @Input() dateObj: any;// get Date for Getting Report data
  public isBarChartLoading: boolean = true;
  public ChartValues: any;
  public loggedInuserDetails: any;
  public SelectedDateRange: any;
  constructor(public router: Router, private empReportService: EmpReportService) { }

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
//************* End **************//
  }
  getDetails = () => {
//************* Get response from API **************//
    this.empReportService.GetCallReportDetails(this.loggedInuserDetails, this.SelectedDateRange, 'Outgoing','Hourly',null,null).subscribe((response) => {
      if (response && response['data']) {
        this.ChartValues = this.PreparedgraphObject(response['data'][1], 'OutgoingHourly', 'Hour');
        this.isBarChartLoading = false;
      }
    });
//************* End **************//
  }
  PreparedgraphObject = (response, chartId,name) => {
//************* Convert Response into Result required for Chart **************//
    if (response) {
      return { id: chartId, response: response, value: ["Completed","Incomplete"], name:name };
    }
//************* End **************//
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
//************* End **************//
}
