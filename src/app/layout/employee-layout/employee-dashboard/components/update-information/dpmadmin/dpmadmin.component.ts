import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { DpmadminService } from 'src/app/shared/services/employee/dpmadmin.service';
// import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
// import { IsourcecampaignModel } from 'src/app/shared/models/employeeModel/adminPanel.model';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { MatSnackBar } from '@angular/material';
import { MatRadioChange } from '@angular/material';
import { Subscription, forkJoin } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IIncentiveModel, Icreateschedule, IsearchDPMModel } from 'src/app/shared/models/employeeModel/dpm.model';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';

@Component({
  selector: 'app-dpmadmin',
  templateUrl: './dpmadmin.component.html',
  styleUrls: ['./dpmadmin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DpmadminComponent implements OnInit, OnDestroy {
  public DateWiseIncentive: string[] = [];
  public showDateReport: boolean = false;
  public tempselectedIncentiveData: string[] = [];
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public IncentiveModel: IIncentiveModel = <IIncentiveModel>{};
  public notFound: boolean = false;
  public IncentiveData: string[] = [];
  public displaySection: boolean = false;
  public showCreateNewButton: boolean = false;
  public isUpdateLoader: boolean = false;
  public insertEndDate: Date;
  public insertStartDate: Date;
  public userDetails: string[] = [];
  public searchText: string = "";
  public rejectedRadio: object[] = [];
  public approvedRadio: object[] = [];
  public createschedule: Icreateschedule = <Icreateschedule>{};
  public incertiveSearchEndDate: string;
  public incertiveSearchStartDate: string;
  public StartDate: Date;
  public EndDate: Date;
  public presalesScheduleList: object[] = [];
  public header: string[] = [];
  public isLoader: boolean = false;
  public ledgendTitle: string = "";
  public disabled: boolean = false;
  public collapsedCreateSchedule: boolean = true;
  public selectedDateRange:  any = { startDate: moment(), endDate:  moment()};
  public IncentiveHistory: string[] = [];
  public PendingScheduleDetails: string[] = [];
  public searchDPMModel: IsearchDPMModel = <IsearchDPMModel>{};
  public startTime: string;
  public endTime: string;
  public updatestartTime: string;
  public updateEndTime: string;
  public selectedDateRangeForSearch: any = { startDate: moment(), endDate: moment().add(6, 'days') };
  public selectedDateRangeIncentiveSearch: string[] = [];
  public selectedDateRangeIncentiveHistorySearch: string[] = [];
  public getPresalesName: string[] = [];
  public Incentiveheader: string[] = [];
  public Incentivedata: string[] = [];
  public selectedIncentiveData: string[] = [];
  public isPopUpLoading = true;
  public modalTitle: string;
  public p1: number;
  public flag: boolean;
  public tempDateWiseIncentive: string[] = [];
  public result: number;
  public ErrorMessage: string = '';
  public RatingModel: any = [];
  public selectedCallrating = [];
  public status: string = '';
  public isSpinner: any;
  public isLoading: boolean = true;
  public list = [
    { key: "Approve", value: "Approved" },
    { key: "Reject", value: "Rejected" }];
  public rangesSearchSchedule: any = {
    'Today': [moment(), moment()],
    'Next 7Days': [moment(), moment().add(6, 'days')],
    'This Month': [moment().startOf('month'), moment()]
  };
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  public storeID = [];
  public minDate: object = moment();
  private _EventSubscription: Array<Subscription> = [];
  @ViewChild('updateSchedulePopup', { static: false }) public updateSchedulePopup: ModalDirective;
  @ViewChild('PendingSchedulePopup', { static: false }) public PendingSchedulePopup: ModalDirective;
  @ViewChild('showDetailsModal', { static: false }) public showDetailsModal: ModalDirective;
  @ViewChild('callRatingPopup', { static: false }) public callRatingPopup: ModalDirective;
  public storeCallDetails: any = [];
  public ratingOn: string[] = [];
  public finalDetails: any = [];
  public storeFinalDetails: any = [];
  public booleanStatus = [
    { key: "Yes", value: true },
    { key: "No", value: false }];

  constructor(public router: Router, private excelService: ExcelService,
    private atp: AmazingTimePickerService, private snackBar: MatSnackBar,
    private DpmadminService: DpmadminService, private empReportService: EmpReportService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getIncentiveNameList();
    this.PendingSchedule();
    this.getActiveUsersList();
    this.getEmployeeList();
    this.selectedDateRange;
    this.insertStartDate = this.insertStartDate ? this.insertStartDate.toLocaleDateString() : moment().startOf('month')['_d'].toLocaleDateString();
    this.insertEndDate = this.insertEndDate ? this.insertEndDate.toLocaleDateString() : moment()['_d'].toLocaleDateString();
    this.employeeIncentive();
    this.getMasterCallRatingDetails('GetAll');
    this.createschedule.Presales = "";
    this.ledgendTitle = "Create Presales Schedule";
  }

  radioChange(event: MatRadioChange, data) {
    data['status'] = event.value;
    let index
    switch (event.value) {
      case 'Approved':
        this.approvedRadio.push(data);
        this.createschedule['eScheduleId'] = this.approvedRadio.map(x => x['EScheduleId']).join(',');
        index = this.rejectedRadio.indexOf(data);
        if (index !== -1) {
          this.rejectedRadio.splice(index, 1);
          this.createschedule['reScheduleId'] = this.rejectedRadio.map(x => x['EScheduleId']).join(',');
        }
        break;
      case 'Rejected':
        this.rejectedRadio.push(data);
        this.createschedule['reScheduleId'] = this.rejectedRadio.map(x => x['EScheduleId']).join(',');
        index = this.approvedRadio.indexOf(data);
        if (index !== -1) {
          this.approvedRadio.splice(index, 1);
          this.createschedule['eScheduleId'] = this.approvedRadio.map(x => x['EScheduleId']).join(',');
        }
        break;
    }
  }
  getEmployeeList = () => {
    //.....method to get all employee Details...........//
    const EmployeeListSub = this.DpmadminService.getEmployeeList(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.getPresalesName = response['data'] ? response['data'].filter(x => x.Role === "PRESALES" && x.EngagementType === 'OnDemand') : [];
      }
    });
    this._EventSubscription.push(EmployeeListSub);
  }
  getActiveUsersList = () => {
    const ActiveUsersSub = this.DpmadminService.getActiveUsers(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.userDetails = response["data"];
      }
    });
    this._EventSubscription.push(ActiveUsersSub);
  }

  // **** Selected Presales incentive Details **** //
  selectedIncentiveDetail = (heading, EmployeeId) => {
    this.loggedInuserDetails['EmployeeId'] = EmployeeId ? EmployeeId : null;
    const IncentiveDetailsSub = this.DpmadminService.getIncentiveDetails(this.loggedInuserDetails, heading, this.insertStartDate, this.insertEndDate).subscribe((response) => {
      if (response && response['data']) {
        this.selectedIncentiveData = this.tempselectedIncentiveData = response['data'];
        this.selectedIncentiveData['showColumn'] = heading ? heading : null;
        this.showDateReport = heading === 'Total Calls' ? true : false;
        this.showDetailsModal.show();
        this.isPopUpLoading = true;
        this.modalTitle = heading;
        this.DateWiseIncentive = this.tempDateWiseIncentive.filter(x => x['EmployeeId'] === EmployeeId);
      } else {
        this.showSnackBar('Records Not Available')
        this.selectedIncentiveData = [];
        this.isPopUpLoading = false;
      }
    });
    this._EventSubscription.push(IncentiveDetailsSub);
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
  onChangeIncentiveSearch = ($event) => {
    if ($event && $event.startDate && $event.startDate._d && $event.endDate._d) {
      this.incertiveSearchStartDate = $event.startDate._d.toLocaleDateString();
      this.incertiveSearchEndDate = $event.endDate._d.toLocaleDateString();
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
  InsertPresalesSchedule = (Input, checkButton, Status) => {
    this.isLoader = true;
    const PresalesScheduleSub = this.DpmadminService.InsertPresalesSchedule(this.loggedInuserDetails, this.createschedule, this.insertStartDate, this.insertEndDate, Input, this.startTime, this.endTime, Status).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar(checkButton + ' Successfully');
      } else {
        this.showFailedBar('Could Not' + checkButton + 'ed. Please Contact IT Support');
      }
      (checkButton === 'approved') ? this.PendingSchedulePopup.hide() : null;

      // this.getPresalesSchedule();
      this.isLoader = false;
      this.disabled = false;
      this.createschedule['Presales'] = "";
      this.createschedule['StartTime'] = null;
      this.createschedule['EndTime'] = null;
      this.Todaydate();
      this.startTime = null;
      this.endTime = null;
      this.ledgendTitle = "Create Presales Schedule";
      this.PendingSchedule();
    });
    this._EventSubscription.push(PresalesScheduleSub);
  }
  employeeIncentive = () => {
    const EmployeeIncentiveSub = this.DpmadminService.getEmployeeIncentive(this.loggedInuserDetails, this.insertStartDate, this.insertEndDate).subscribe((response) => {
      if (response && response["data"] && response["data"][0][0]) {
        this.Incentivedata = response['data'][0] ? response['data'][0] : [];
        this.DateWiseIncentive = this.tempDateWiseIncentive = response['data'][1];
        let array = Object.keys(response['data'][0][0]);
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
            }
            else {
              item.toLocaleLowerCase() === 'name' ? this.Incentiveheader.splice(index, 1) : null;
            }
          });
          element['Total'] = total;
        });
        // this.Incentiveheader = Object.keys(response["data"][0]);
        // this.Incentivedata = Object.values(response["data"][0]);
      }
      this._EventSubscription.push(EmployeeIncentiveSub);
    });
  }
  editIncentive = (details) => {
    this.IncentiveModel = <IIncentiveModel>{};
    this.IncentiveModel.IncentiveOn = details.IncentiveOn ? details.IncentiveOn : null;
    this.IncentiveModel.IncentiveId = details.IncentiveId ? details.IncentiveId : null;
    this.IncentiveModel.price = details.price ? details.price : null;
    this.IncentiveModel.StdRate = details.StdRate ? details.StdRate : null
    let a = details.EffectiveStartDate ? details.EffectiveStartDate.toString('yyyy/mm/dd').split('T') : null;
    this.IncentiveModel.EffectiveStartDate = a ? a[0] : null;
    let b = details.EffectiveEndDate ? details.EffectiveEndDate.toString('yyyy/mm/dd').split('T') : null;
    this.IncentiveModel.EffectiveEndDate = b ? b[0] : null;
    this.showCreateNewButton = true;
    this.displaySection = true;
  }
  UpdateIncentive = (Input) => {
    this.isUpdateLoader = true;
    const UpdateincentiveSub = this.DpmadminService.UpdateIncentiveService(this.loggedInuserDetails, this.IncentiveModel, Input).subscribe((response) => {
      (response && response['successful']) ?
        this.showSuccessBar('Updated Successfully') : this.showFailedBar('Could Not Updated. Please Contact IT Support.');

      this.getIncentiveNameList();
      this.isUpdateLoader = false;
      this.disabled = false;
      this.IncentiveModel.IncentiveOn = null;
      this.IncentiveModel.price = null;
      setTimeout(() => {
        this.displaySection = false;
      }, 3000);
    });
    this._EventSubscription.push(UpdateincentiveSub);
  }
  openPendingSchedule = () => {
    this.PendingSchedulePopup.show();
  }
  PendingSchedule = () => {
    const PendingScheduleSub = this.DpmadminService.PresalesPendingSchedule(this.loggedInuserDetails, this.incertiveSearchStartDate, this.incertiveSearchEndDate, this.searchDPMModel).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.PendingScheduleDetails = response["data"];
        let getData = this.PendingScheduleDetails.find(x => x['PendingBy'] !== this.loggedInuserDetails.UserId);
        this.flag = getData ? true : false;
      } else {
        this.PendingScheduleDetails = [];
      }
    });
    this._EventSubscription.push(PendingScheduleSub);
  }

  getPresalesSchedule = () => {
    //this.Next7Days();
    // this.StartDate = this.StartDate ? this.StartDate.toLocaleDateString() : new Date().toLocaleDateString();
    // this.EndDate = this.EndDate ? this.EndDate.toLocaleDateString() : moment().add(6, 'days')['_d'].toLocaleDateString();
    this.presalesScheduleList = [];
    const PresalesScheduleSub = this.DpmadminService.displayPresalesSchedule(this.loggedInuserDetails, this.StartDate, this.EndDate, this.searchDPMModel).subscribe((response) => {
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
      } else {
        this.notFound = true;
      }
    });
    this._EventSubscription.push(PresalesScheduleSub);
  }
  getIncentiveNameList = () => {
    const IncentiveName = this.DpmadminService.getIncentiveNames(this.loggedInuserDetails, this.incertiveSearchStartDate, this.incertiveSearchEndDate).subscribe((response) => {
      if (response && response["data"] && response["data"][0].length > 0) {
        this.IncentiveData = response["data"][0];
      }
      if (response && response["data"] && response["data"][1].length > 0) {
        this.IncentiveHistory = response["data"][1];
      }
    });
    this._EventSubscription.push(IncentiveName);
  }

  clearDPMInsert = () => {
    this.createschedule.Presales = '';
    this.createschedule.StartTime = null;
    this.createschedule.EndTime = null;
    this.selectedDateRange = null;
    this.disabled = false;
  }
  openSchedulepopup = (details) => {
    this.createschedule.Presales = details.EmployeeId;
    this.disabled = true;
    this.ledgendTitle = "Update Presales Schedule";
    this.collapsedCreateSchedule = false;
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
  SetUpdateStartTime = () => {
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.updatestartTime = time;
    });
  }
  SetUpdateEndTime = () => {
    //************ open Time Click *************//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.updateEndTime = time;
    });
  }
  getToday(): string {
    //************ can not select future date *************//
    return new Date().toISOString().split('T')[0];
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  onClose = () => {
    //************* For Close Pop Up *************//
    this.PendingSchedulePopup.hide();
    this.showDetailsModal.hide();
    //************* End *************//
  }

  exportEvent() {
    //*********  Export All Referral Details From Table *********//
    this.excelService.exportAsExcelFile(this.selectedIncentiveData, 'ExcelSheet');
    //********* End *********//
  }
  //******** show snackbar for message ********//
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

  //-----validation check for rating-----//
  validation = (data) => {
    data.rating = data.rating ? data.rating : null;
    if (data.rating > data.Points) {
      this.result = data.CRSubMasterId;
      this.ErrorMessage = "Point exceeds than score";
    }
    else {
      this.ErrorMessage = "";
    }
  }

  //----- get call rating data as per input -----//
  getMasterCallRatingDetails = (Input) => {
    this.empReportService.getMasterData(this.loggedInuserDetails, Input, this.RatingModel['CallId']).subscribe((response) => {
      if (Input === 'GetAll') {
        if (response && response['data'] && response['data'] && response['data'].length > 0) {
          this.selectedCallrating = response['data'];
          let test1 = response["data"].map(data => data.CRMasterId).filter((x, i, a) => x && a.indexOf(x) === i);
          this.storeFinalDetails = this.finalDetails = [];
          this.storeFinalDetails = this.finalDetails = test1.map((crmId) => {
            let name = response["data"].filter(x => x['CRMasterId'] === crmId);
            return {
              CRMasterId: crmId,
              RatingOn: this.selectedCallrating.find(x => x['CRMasterId'] === crmId)['RatingOn'],
              SubData: name
            }
          });
        }
      }
      if (Input === 'GetByCallId') {
        if (response && response['data']) {
          this.selectedCallrating = (response['data'] && response['data'].length > 0) ? response['data'][0] : [];
          this.RatingModel['AutoFail1'] = this.selectedCallrating['AutoFail1'] !== null ? this.selectedCallrating['AutoFail1'] : null;
          this.RatingModel['AutoFail2'] = this.selectedCallrating['AutoFail2'] !== null ? this.selectedCallrating['AutoFail2'] : null;
          this.RatingModel['Remark'] = (this.selectedCallrating && this.selectedCallrating['Remark']) ? this.selectedCallrating['Remark'] : null;
          let test1 = (response['data'][0] && response['data'][0]['CRSubmasterId']) ? response['data'][0]['CRSubmasterId'].split(',') : [];
          let test2 = (response['data'][0] && response['data'][0]['Score']) ? response['data'][0]['Score'].split(',') : [];
          this.finalDetails.map(element => {
            element.SubData.map(sub => {
              let i = test1.findIndex(x => Number(x) === Number(sub['CRSubMasterId']));
              sub['rating'] = (i !== -1) ? test2[i] : null;
            });
          });
        }
      }
    });
  }
  //----- get selected call rating details 7 open popup -----//
  openRatingPopup = (data) => {
    this.showDetailsModal.hide();
    this.RatingModel['CallId'] = data.CallId;
    this.RatingModel['UserType'] = data.Usertype;
    this.RatingModel['EntityId'] = data.EnquiryId;
    //this.RatingModel['EntityId'] = data.EntityId;
    this.getMasterCallRatingDetails('GetByCallId');
    this.callRatingPopup.show();

  }
  onCloseRating = () => {
    this.callRatingPopup.hide();
  }
  InsertUpdaterating = () => {
    let test1 = [];
    this.finalDetails.map(main => {
      main.SubData.map(sub => {
        if (sub['rating'] && sub['rating'] !== '') {
          test1.push({
            CRSubMasterId: sub['CRSubMasterId'],
            Score: sub['rating']
          });
        }
      });
    });

    let Id = test1.map(x => x['CRSubMasterId']).join(',');
    let Rating = test1.map(x => x['Score']).join(',');

    this.empReportService.InsertUpdatecallrating(this.loggedInuserDetails, this.RatingModel, Id, Rating).subscribe((response) => {
      if (response && response['successful']) {
        this.showSnackBar('Rating Submitted Successfully');
      } else {
        this.showSnackBar('Could Not Submit Rating.Contact IT Support');
      }
      // this.selectedIncentiveDetail(heading, EmployeeId);
      this.callRatingPopup.hide();
      this.RatingModel = [];
      this.showDetailsModal.show();
    });
  }
  Todaydate=()=>{
    this.selectedDateRange={ startDate: moment(), endDate:  moment()};
   }

  //** action for ng On Destroy  **/
  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}
