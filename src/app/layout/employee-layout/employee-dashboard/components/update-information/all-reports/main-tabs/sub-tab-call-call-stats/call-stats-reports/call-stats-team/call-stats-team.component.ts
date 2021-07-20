import { Component, OnInit, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { ReportIssueService } from 'src/app/shared/services/customer/report-issue.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tru-call-stats-team',
  templateUrl: './call-stats-team.component.html',
  styleUrls: ['./call-stats-team.component.scss']
})
export class CallStatsTeamComponent implements OnInit, OnDestroy {
  message: boolean = false;
  public chartValues: any;
  public isBarChartLoading: boolean = true;
  public loggedInuserDetails: any;
  public SelectedDateRange: any;
  public teamdata: any = [];
  public namearray: any;
  public optionValue: any;
  public chartvalue: any;
  public Option: any;
  public Name: any;
  public options: any = [
    { option: 'Total Incoming Calls', value: 'Total Incoming Calls' },
    { option: 'Incoming Calls - Answered', value: 'Incoming Calls - Answered' },
    { option: 'Incoming Calls - Not-Answered', value: 'Incoming Calls - Not-Answered' },
    { option: 'Incoming Talktime', value: 'Incoming Talktime' },
    { option: 'Total Outgoing Calls', value: 'Total Outgoing Calls' },
    { option: 'Outgoing Calls - Answered', value: 'Outgoing Calls - Answered' },
    { option: 'Outgoing Calls - Not-Answered', value: 'Outgoing Calls - Not-Answered' },
    { option: 'Outgoing Talktime', value: 'Outgoing Talktime' }
  ];

  public getTeamOptionSubscription: Subscription;
  public getDetailsSubscription: Subscription;
  @Input() dateObj: any; // get Date for Getting Report data

  constructor(
    public router: Router,
    private empReportService: EmpReportService,
    private reportIssueService: ReportIssueService) { }
  ngOnInit() {
    //************* Login Authorization **************//
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getTeamOption();
      } else {
        this.router.navigate(['/login']);
      }
    }
    //************* End **************//
  }
  getTeamOption = () => {
    //************* Get Options For Dropdown **************//
    this.getTeamOptionSubscription = this.reportIssueService.GetProjectNameList(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        this.teamdata = response['data'];
        this.isBarChartLoading = false;
      }
    });   
  }
  getReport(Option, Name) {
    //************* Button Click Event For Generating Charts **************//
    //this.namearray=Array.prototype.map.call(Name, function(item) { return item.Name; }).join(",");
    this.getDetails(Option, Name);   
  }
  getDetails = (Option, Name) => {
    //************* Get response from API **************//
    if (Option == null && Name == null) {
      this.message = true;
    } else {
      this.message = false;
      this.getDetailsSubscription = this.empReportService.GetCallReportDetails(this.loggedInuserDetails, this.SelectedDateRange, 'Call_Stats', 'Team', Option, Name).subscribe((response) => {
        if (response && response['data']) {
          this.chartValues = this.PreparedgraphObject(response['data'][0], 'CallStatsDailyTeam', 'Date');
          this.chartvalue = this.PreparedgraphObject(response['data'][1], 'CallStatsHourlyTeam', 'Hour');
          this.isBarChartLoading = false;
        }
      });
    }   
  }

  PreparedgraphObject = (response, chartId, name) => {
    //************* Convert Response into Result required for Chart **************//
    if (response) {
      let axisValue = Object.keys(response[0]);
      let index = axisValue.indexOf(name);
      if (index !== -1) {
        axisValue.splice(index, 1);
      }
      return { id: chartId, response: response, value: axisValue, name: name };
    }
    //************* End  **************//
  }

  ngOnChanges(changes: SimpleChanges) {
    //************* On date change get Report data **************//
    if (changes && this.dateObj) {
      this.SelectedDateRange = this.dateObj;
      if (this.loggedInuserDetails != null && this.loggedInuserDetails != undefined) {
        this.getTeamOption();
        this.getReport(this.Option, this.Name)
      }
    }
  }

  ngOnDestroy() {
    this.getDetailsSubscription ? this.getDetailsSubscription.unsubscribe() : null;
    this.getTeamOptionSubscription ? this.getTeamOptionSubscription.unsubscribe() : null;
  }
}
