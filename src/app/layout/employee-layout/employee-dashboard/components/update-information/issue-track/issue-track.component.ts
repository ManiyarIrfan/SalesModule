import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { IssueTrackService } from 'src/app/shared/services/employee/issue-track.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
@Component({
  selector: 'tru-issue-track',
  templateUrl: './issue-track.component.html',
  styleUrls: ['./issue-track.component.scss']
})
export class IssueTrackComponent implements OnInit {
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public StartDate: any;
  public EndDate: any;
  public p1: number;
  public TodaysDateMsg: string = '';
  public selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
  public IssueDetails = [];
  public getIssuesDetailsSubscribtion: Subscription;
  public updateIssuesDetailsSubscribtion: Subscription;
  @ViewChild('issueDetailsModal', { static: false }) public issueDetailsModal: ModalDirective;
  @ViewChild('issueUpdateModal', { static: false }) public issueUpdateModal: ModalDirective;
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  public IsusueResponse: string;
  public IsusueRequest: string;
  public noDataMsg: string = '';
  public UpdateStatusModel: string;
  public StatusInfo: any = [
    { key: "New", value: "New" },
    { key: "Solved", value: "Solved" }
  ];
  constructor(private issueTrackService: IssueTrackService, public router: Router) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails) {
      this.StartDate = moment();
      this.EndDate = moment();
      this.getIssuesDetails(this.StartDate, this.EndDate);
      this.TodaysDateMsg = 'By default Todays Date is Selected';
      this.selectedDateRange = { startDate: moment(), endDate: moment() };
    }
  }

  onChangeDate = (selectedDateRange) => {
    if (selectedDateRange != undefined && selectedDateRange.startDate != null && selectedDateRange.endDate != null) {
      //********* when date range change *********//
      this.StartDate = selectedDateRange.startDate;
      this.EndDate = selectedDateRange.endDate;
      this.getIssuesDetails(this.StartDate, this.EndDate)
      //********* End *********// 
    }
  }
  getIssuesDetails = (startDate, endDate) => {
    //*********  Todays all Issues information in grid *********//
    this.getIssuesDetailsSubscribtion = this.issueTrackService.GetIssueDetails(this.loggedInuserDetails, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
      .subscribe((response) => {
        if (response && response["data"] && response["data"] && response["data"].length > 0) {
          this.IssueDetails = response["data"];
          this.noDataMsg = '';
        } else {
          this.IssueDetails = [];
          this.noDataMsg = 'No data found for selected Date ranges';
        }
      });
    //********* End *********//
  }

  updateIssuesDetails = () => {
    this.UpdateStatusModel['Status'] = 'Solved';
    this.updateIssuesDetailsSubscribtion = this.issueTrackService.UpdatetIssueDetails(this.loggedInuserDetails, this.UpdateStatusModel).subscribe((response) => {
      if (response && response["data"] && response["data"]) {
        this.getIssuesDetails(this.StartDate, this.EndDate);
        this.issueUpdateModal.hide();
      }
    });
    //********* End *********//
  }
  //show and hide popUp to show issue response and request
  showDetailsPopUp = (details, input) => {
    if (input === 'open') {
      this.IsusueResponse = details.Response;
      this.IsusueRequest = details.Request;
      this.issueDetailsModal.show();
    } else {
      this.issueDetailsModal.hide();
    }
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.issueDetailsModal.hide();
      this.issueUpdateModal.hide();
    }
  }
  //show and hide popUp to show Update issue Status
  showStatusPopUp = (issue, input) => {
    if (input === 'open') {
      if (issue.Status === 'New') {
        this.UpdateStatusModel = issue;
        this.issueUpdateModal.show();
      }
    } else {
      this.issueUpdateModal.hide();
    }
  }
  isInvalidDate = (m: moment.Moment) => {
    //-----if invalid date is selected-----//
    return this.invalidDates.some(d => d.isSame(m, 'day'))
    //-----End-----//
  }

  ngOnDestroy() {
    //------ Unsubscribe All Service -------//
    this.getIssuesDetailsSubscribtion ? this.getIssuesDetailsSubscribtion.unsubscribe() : null;
    this.updateIssuesDetailsSubscribtion ? this.updateIssuesDetailsSubscribtion.unsubscribe() : null;
  }
}

