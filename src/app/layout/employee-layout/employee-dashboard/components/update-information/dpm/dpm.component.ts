import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DpmService } from 'src/app/shared/services/employee/dpm.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ModalDirective } from 'ngx-bootstrap';
import { MatSnackBar } from '@angular/material';
import { MatRadioChange } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { Icreateschedule } from 'src/app/shared/models/employeeModel/dpm.model';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dpm',
  templateUrl: './dpm.component.html',
  styleUrls: ['./dpm.component.scss']
})
export class DpmComponent implements OnInit {
  public startTime: string;
  public endTime: string;
  public StartDate: Date;
  public EndDate: Date;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public isLoader: boolean = false;
  public createschedule: Icreateschedule = <Icreateschedule>{};
  public presalesScheduleList: object[] = [];
  public header: string[] = [];
  public ledgendTitle: string = "";
  public filterData: string[] = [];
  public selectedDateRange: string;
  public p1: number;
  public insertEndDate: string;
  public insertStartDate: string;
  public collapsedCreateSchedule: boolean = true;
  public selectedDateRangeForIncentiveSearch: any = { startDate: moment().startOf('month'), endDate: moment() };
  public selectedIncentiveData: string[] = [];
  public PendingScheduleDetails: string[] = [];
  public rejectedRadio = [];
  public approvedRadio = [];
  public pendingSchedule: boolean = false;
  public isPopUpLoading = true;
  public j: number;
  public CurrentPageId: number = 1;
  public minDate: object = moment().add(2, 'days');
  public selectedDateRangeForPendingSearch: any = { startDate: moment(), endDate: moment().add(6, 'days') };
  public selectedDateRangeForSearch: any = { startDate: moment(), endDate: moment().add(6, 'days') };
  public notFound: boolean = false;
  public Incentiveheader: string[] = [];
  public Incentivedata: string[] = [];
  public modalTitle: any;
  public flag: boolean;
  public disableBtn: boolean = false;
  public DateWiseIncentive: string[] = [];
  public showDateReport: boolean = false;
  public tempselectedIncentiveData: string[] = [];
  public approveCount:Number=0;
  public RejectCount:Number=0;

  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  public list = [
    { key: "Approve", value: "Approved" },
    { key: "Reject", value: "Rejected" }];
  public rangesSearchSchedule: any = {
    'Today': [moment(), moment()],
    'Next 7Days': [moment(), moment().add(6, 'days')],
  };
  @ViewChild('updateSchedulePopup', { static: false }) public updateSchedulePopup: ModalDirective;
  @ViewChild('showDetailsModal', { static: false }) public showDetailsModal: ModalDirective;
  @ViewChild('PendingSchedulePopup', { static: false }) public PendingSchedulePopup: ModalDirective;

  public reportSubscription: Array<Subscription> = []
  public countTotal: number;
  tempDateWiseIncentive: string[] = [];

  constructor(public router: Router, private DpmService: DpmService,
    private atp: AmazingTimePickerService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.createschedule.Presales = "";
    this.ledgendTitle = "Create Schedule";
    this.getPresalesSchedule();
    this.PendingSchedule();
    this.employeeIncentive();
  }

  employeeIncentive = () => {
    this.presalesScheduleList = [];
    const getEmployeeIncentive = this.DpmService.getEmployeeIncentive(this.loggedInuserDetails, this.insertStartDate, this.insertEndDate);
    const forkJoinSub = forkJoin([getEmployeeIncentive]).subscribe(response => {
      if (response) {
        if (response[0] && response[0]["data"] && response[0]["data"][0][0]) {
          this.Incentivedata = response[0]['data'][0] ? response[0]['data'][0] : [];
          this.DateWiseIncentive = this.tempDateWiseIncentive = response[0]['data'][1];
          let array = Object.keys(response[0]['data'][0][0]);
          let findIndex = array.indexOf('EmployeeId');
          if (findIndex > -1) {
            array.splice(findIndex, 1);
          }
          this.Incentiveheader = array;
          let index = this.Incentiveheader.findIndex(x => x.toLocaleLowerCase() === '"name"');
          index !== -1 ? this.Incentiveheader.splice(index, 1) : null;
          this.Incentivedata.forEach(element => {
            let total = 0;
            this.Incentiveheader.forEach((item, index) => {
              if (item.toLocaleLowerCase() !== 'name') {
                element[item] = element[item] ? element[item] : 0;
                total += element[item] ? element[item] : 0;
              } else {
                item.toLocaleLowerCase() === 'name' ? this.Incentiveheader.splice(index, 1) : null;
              }
            });
            element['Total'] = total;
          });
        }
      }
    });
    this.reportSubscription.push(forkJoinSub);
  }
  getPresalesSchedule = () => {
    // this.StartDate = this.StartDate ? this.StartDate : new Date().toLocaleDateString();
    // this.EndDate = this.EndDate ? this.EndDate : moment().add(6, 'days')['_d'].toLocaleDateString();
    this.presalesScheduleList = [];
    const displayPresalesSchedule = this.DpmService.displayPresalesSchedule(this.loggedInuserDetails, this.StartDate, this.EndDate).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        let test1 = response["data"].map(data => data.EmployeeId).filter((x, i, a) => x && a.indexOf(x) === i);
        this.presalesScheduleList = [];
        test1.forEach((empId, i) => {
          let name = response["data"].filter(x => x['EmployeeId'] === empId);
          this.presalesScheduleList.push({
            EmployeeId: empId,
            StartTime: (name.length > 0) ? name[0].StartTime : null,
            EndTime: (name.length > 0) ? name[0].EndTime : null,
            Name: (name.length > 0) ? name[0].Name : null
          });
          this.header.forEach(date => {
            let filterData = response["data"].filter(x => x['EmployeeId'] === empId && new Date(x['ScheduleDate']).toDateString() === date);
            this.presalesScheduleList[i][date] = { ST: (filterData.length > 0) ? filterData[0].StartTime : null, ET: (filterData.length > 0) ? filterData[0].EndTime : null }
          });
        });
        this.notFound = false;
      }
      else {
        this.notFound = true;
      }
    });
    this.reportSubscription.push(displayPresalesSchedule);
  }

  selectedIncentiveDetail = (heading) => {
    const getIncentiveDetails = this.DpmService.getIncentiveDetails(this.loggedInuserDetails, heading, this.insertStartDate, this.insertEndDate).subscribe((response) => {
      if (response && response['data'].length > 0) {
        this.selectedIncentiveData = this.tempselectedIncentiveData = response['data'];
        this.selectedIncentiveData['showColumn'] = heading ? heading : null;
        this.showDateReport = heading === 'Total Calls' ? true : false;
        this.DateWiseIncentive = this.tempDateWiseIncentive.filter(x => x['EmployeeId'] === this.loggedInuserDetails.EntityId);

        this.showDetailsModal.show();
        this.isPopUpLoading = true;
        this.modalTitle = heading;
      } else {
        this.showSnackBar('Records Not Available')
        this.selectedIncentiveData = [];
        this.isPopUpLoading = false;
      }
      this.countTotal = this.selectedIncentiveData.length;
    });
    this.reportSubscription.push(getIncentiveDetails);
  }
  // **** Selected Date filter for incentive Details **** //
  SelectedDateDetails = (detail) => {
    this.selectedIncentiveData = this.tempselectedIncentiveData.filter(x => new Date(x['Createdon']).toLocaleDateString() === new Date(detail.CreatedOn).toLocaleDateString());
    this.showDateReport = false;
  }
  onChangeDate = ($event) => {
    if ($event && $event.startDate && $event.startDate._d && $event.endDate._d) {
      this.insertStartDate = $event.startDate._d.toDateString();
      this.insertEndDate = $event.endDate._d.toDateString();
    }
  }
  onChangeDateOnSearch = ($event) => {
    if ($event && $event.startDate._d && $event.endDate._d) {
      this.header = [];
      this.StartDate = $event.startDate._d.toDateString();
      this.EndDate = $event.endDate._d.toDateString();
      let one_day = 1000 * 60 * 60 * 24;
      let SD = Math.floor(((new Date($event.startDate._d.toDateString()).getTime() - new Date(new Date().toDateString()).getTime())) / one_day);
      let ED = Math.abs(Math.floor((new Date(new Date().toDateString()).getTime() - new Date($event.endDate._d.toDateString()).getTime()) / one_day));
      // let SD = Math.floor((($event.startDate._d).getTime() - new Date().getTime()) / one_day);
      // let ED = Math.abs(Math.floor((new Date().getTime() - ($event.endDate._d).getTime()) / one_day));
      for (var i = SD; i <= ED; i++) {
        var d = new Date();
        this.header.push((new Date(d.setDate(d.getDate() + i))).toDateString());
      }
    }
  }
  openPendingSchedule = () => {
    this.PendingSchedulePopup.show();
  }
  PendingSchedule = () => {
    const PresalesPendingSchedule = this.DpmService.PresalesPendingSchedule(this.loggedInuserDetails, this.StartDate, this.EndDate).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.PendingScheduleDetails = response["data"];
        let test = this.PendingScheduleDetails.find(x => x['PendingBy'] !== this.loggedInuserDetails.UserId);
        this.flag = test ? true : false;
        this.pendingSchedule = false;
      } else {
        this.PendingScheduleDetails = [];
        this.pendingSchedule = true;
      }
    });
    this.reportSubscription.push(PresalesPendingSchedule);
  }
  InsertPresalesSchedule = (Input, checkButton, Status) => {
    if(this.approveCount !=0 || this.RejectCount !=0)
    {
      this.isLoader = true;
      this.disableBtn = true;
      const InsertPresalesSchedule = this.DpmService.InsertPresalesSchedule(this.loggedInuserDetails, this.createschedule, this.insertStartDate, this.insertEndDate, Input, this.startTime, this.endTime, Status).subscribe((response) => {
        if (response && response['successful']) {
          // this.showSuccessBar('Schedule ' + checkButton + 'ed Successfully');
          this.showSuccessBar('Schedule ' + this.approveCount + ' Successfully Approved and Rejected ' + this.RejectCount)
        } else {
          this.showFailedBar('Could Not' + checkButton + 'ed. Please Contact IT Support');
        }
        this.approveCount=0;
        this.RejectCount=0;
        (checkButton === 'approved') ? this.PendingSchedulePopup.hide() : null;
        this.disableBtn = false;
        this.isLoader = false;
        this.clearDPMInsert();
        this.ledgendTitle = "Create Schedule";
        this.PendingSchedule();
      });
      this.reportSubscription.push(InsertPresalesSchedule);
    }
    else{
      this.showFailedBar('Please Approve or Reject the Schedule');
    }
  }
  radioChange(event: MatRadioChange, data) {
    data['status'] = event.value;
    if (event.value === 'Approved') {
      this.approvedRadio.push(data);
      this.createschedule['eScheduleId'] = this.approvedRadio.map(x => x['EScheduleId']).join(',');
     this.approveCount=this.approvedRadio.map(x => x['EScheduleId']).length?this.approvedRadio.map(x => x['EScheduleId']).length:0;  
      let index = this.rejectedRadio.indexOf(data);
      if (index !== -1) {
        this.rejectedRadio.splice(index, 1);
        this.createschedule['reScheduleId'] = this.rejectedRadio.map(x => x['EScheduleId']).join(',');
        this.RejectCount=this.rejectedRadio.map(x => x['EScheduleId']).length?this.rejectedRadio.map(x => x['EScheduleId']).length:0;
      }
    }
    if (event.value === 'Rejected') {
      this.rejectedRadio.push(data)
      this.createschedule['reScheduleId'] = this.rejectedRadio.map(x => x['EScheduleId']).join(',');
      this.RejectCount=this.rejectedRadio.map(x => x['EScheduleId']).length?this.rejectedRadio.map(x => x['EScheduleId']).length:0;
      let index = this.approvedRadio.indexOf(data);
      if (index !== -1) {
        this.approvedRadio.splice(index, 1);
        this.createschedule['eScheduleId'] = this.approvedRadio.map(x => x['EScheduleId']).join(',');
        this.approveCount=this.approvedRadio.map(x => x['EScheduleId']).length?this.approvedRadio.map(x => x['EScheduleId']).length:0;
      }
    }
  }
  clearDPMInsert = () => {
    this.createschedule.Presales = null;
    this.createschedule.StartTime = null;
    this.createschedule.EndTime = null;
    this.selectedDateRange = null;
    this.insertStartDate = null;
    this.insertEndDate = null;
    this.startTime = null;
    this.endTime = null;
    this.ledgendTitle = "Create Schedule";
  }
  close = () => {
    this.showDetailsModal.hide();
  }
  onClose = () => {
    this.PendingSchedulePopup.hide();
  }
  SetStartTime = () => {
    //************ open Time Click *************//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.startTime = time;
    });
  }
  SetEndTime = () => {
    //************ open Time Click *************//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.endTime = time;
    });
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  showSnackBar = (message: string) => {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
  //------- success snabar method -------//
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['red-snackbar'] });
  }
  ngOnDestroy() {
    for (let item of this.reportSubscription) {
      item.unsubscribe();
    }
  }
}