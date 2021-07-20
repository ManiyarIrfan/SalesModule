import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { IfilterSubTanCon } from 'src/app/shared/models/employeeModel/FilterDetails.model';
import { ModalDirective } from 'ngx-bootstrap';
import { MatSnackBar } from '@angular/material';
import { Subscription } from "rxjs";
import { IcallCheckList } from "src/app/shared/models/employeeModel/lead-detail.model";
@Component({
  selector: 'tru-sub-tab-conversation',
  templateUrl: './sub-tab-conversation.component.html',
  styleUrls: ['./sub-tab-conversation.component.scss']
})
export class SubTabConversationComponent implements OnInit, OnChanges {
  @Input() dateObj: any;// Get date for passing to another Component
  @Input() reportType: any;
  @ViewChild("showOnCallNotesPopup", { static: false }) public showOnCallNotesPopup: ModalDirective;
  @ViewChild('callRatingPopup', { static: false }) public callRatingPopup: ModalDirective;
  public selectedCallrating = [];
  public filterDataModel: IfilterSubTanCon = <IfilterSubTanCon>{};
  public loggedInuserDetails: any;
  public selectedDateRange: any;
  public isLoading: boolean = true;
  public conversationDetailsList: string[] = [];
  public callCheckList: IcallCheckList[] = [];
  public status: string = '';
  public isSpinner: boolean = false;
  public Name: string;
  public callObservationList: object[] = [];
  public rating: any = [];
  public conversationDetail: any = [];
  public StatusCurrent: any = [];
  public arrString: any = [];
  public callTypeList: any = [
    { key: "", value: "All" },
    { key: "Incoming", value: "Incoming" },
    { key: "Outbound-api", value: "Outgoing" }];
  public siteVisitTypeList: any = [
    { key: "", value: "All" },
    { key: "Site visit Schedule", value: "Scheduled" },
    { key: "Site visit Conducted", value: "Conducted" },
    { key: "SitevisitCreated", value: "Created" }];
  public followUpTypeList: any = [
    { key: "", value: "All" },
    { key: "Scheduled", value: "Scheduled" },
    { key: "Done", value: "Done" },
    { key: "Canceled", value: "Canceled" }];
  public filterAllPresalesLead: string[] = [];
  public ListOffilter = [
    { item: 'Status' },
    { item: 'PreferredProject' },
    { item: 'AgentName' },
    { item: 'Duration' },
    { item: 'SalesAgentAssigned' },
    { item: 'CreatedOn' },
    { item: 'PresalesAgentName' },
    { item: 'SiteVisitSchedule' },
    { item: 'ConductedOn' },
    { item: 'BookingStatus' },
    { item: 'callAttendedBy' }]
  public booleanStatus = [
    { key: "Yes", value: true },
    { key: "No", value: false }];
  public NodataFound: boolean = true;
  private _EventSubscription: Array<Subscription> = [];
  public ratingOn: string[] = [];
  public finalDetails: any = [];
  public storeFinalDetails: any = [];
  public result: number;
  public ErrorMessage: string = '';
  public RatingModel: any = [];

  constructor(
    private empReportService: EmpReportService,
    private router: Router,
    private excelService: ExcelService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getConversationDetails('');
        this.getMasterCallRatingDetails('GetAll');
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //-----if date range change-----//
    if (changes && this.dateObj && this.reportType) {
      this.selectedDateRange = this.dateObj;
      if (this.loggedInuserDetails && this.loggedInuserDetails !== '') {
        this.getConversationDetails('');
      }
    }
    //-----End-----//
  }

  //**** checklIst of Call Observation *****//
  callObservationData = () => {
    const callObservationSub = this.empReportService.callObservation(this.loggedInuserDetails, this.conversationDetail).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.callCheckList = [];
        this.callCheckList = response["data"];

      } 
    });
    this._EventSubscription.push(callObservationSub);
  };
  //-----snakbar to display message-----//
  showSnackBar = (message: string) => {
    this.snackBar.open(message, 'Close', { duration: 3000 });
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
    const GetMastercallRating = this.empReportService.getMasterData(this.loggedInuserDetails, Input, this.RatingModel['CallId']).subscribe((response) => {
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
    this._EventSubscription.push(GetMastercallRating);
  }
  //----- get selected call rating details 7 open popup -----//
  openRatingPopup = (data) => {
    this.RatingModel['CallId'] = data.CallId;
    this.RatingModel['UserType'] = data.UserType
    this.RatingModel['LeadId'] = data.LeadId
    this.getMasterCallRatingDetails('GetByCallId');
    this.callRatingPopup.show();
  }
  onClose = () => {
    this.callRatingPopup.hide();
  }

  openCallNotesPopup = (data) => {
    this.conversationDetail = data;
    this.showOnCallNotesPopup.show();
    this.callObservationData();
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

    const InsertUpdatecallrating = this.empReportService.InsertUpdatecallrating(this.loggedInuserDetails, this.RatingModel, Id, Rating).subscribe((response) => {
      if (response && response['successful']) {
        this.showSnackBar('Rating Submitted Successfully');
      } else {
        this.showSnackBar('Could Not Submit Rating.Contact IT Support');
      }
      this.getConversationDetails(this.status);
      this.callRatingPopup.hide();
      this.RatingModel = [];
    });
    this._EventSubscription.push(InsertUpdatecallrating);
  }
  //-----get conversation details as per status-----//
  getConversationDetails = (status) => {
    this.status = status;
    this.isLoading = true;
    let typeModel = {};
    typeModel['ReportType'] = this.reportType;
    typeModel['Status'] = this.status;
    typeModel['FromDate'] = (this.selectedDateRange && this.selectedDateRange.startDate) ? this.selectedDateRange.startDate._d.toDateString() : null;
    typeModel['ToDate'] = (this.selectedDateRange && this.selectedDateRange.endDate) ? this.selectedDateRange.endDate._d.toDateString() : null;
    this.conversationDetailsList = [];
    const getConversationDetails = this.empReportService.getConversationDetails(this.loggedInuserDetails, typeModel).subscribe((response) => {
      if (response && response['data'][0].length > 0) {
        this.conversationDetailsList = response['data'][0];
        this.filterAllPresalesLead = this.conversationDetailsList;
        this.NodataFound = false;
      } else {
        this.NodataFound = true;
      }
      this.isLoading = false;
    });
    this._EventSubscription.push(getConversationDetails);
  }
  //----- send details to enquiry or lead details tab -----//
  getDetails = (details) => {
    details.id = details.EnquiryId ? details.EnquiryId : details.LeadId;
    details.tabNo = details.UserType === 'Enquiry' ? `tab14` : `tab15`;
    details.id ? this.sharedService.allLeadSearchDetails(details) : null;
  }
  //********* End *********//
  exportEvent() {
    //*********  Export All conversation Details From Table *********//
    this.excelService.exportAsExcelFile(this.conversationDetailsList, 'ExcelSheet');
  }

  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.conversationDetailsList : this.filterAllPresalesLead;
        this.conversationDetailsList = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.conversationDetailsList = counter === 0 ? this.filterAllPresalesLead : this.conversationDetailsList;
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  //** action for ng On Destroy  **/
  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.showOnCallNotesPopup.hide();
    }
  }
}
