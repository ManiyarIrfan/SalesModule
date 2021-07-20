import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { PreSalesLeadsService } from 'src/app/shared/services/employee/pre-sales-leads.service';
@Component({
  selector: 'tru-sub-tab-lead-bystatus',
  templateUrl: './sub-tab-lead-bystatus.component.html',
  styleUrls: ['./sub-tab-lead-bystatus.component.scss']
})
export class SubTabLeadBystatusComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('showReportsDetailsModal', { static: false }) public showReportsDetailsModal: ModalDirective;
  @Input() dateObj: any;
  public loggedInuserDetails: any;
  public selectedDateRange: any;
  public getLeadByStatus: any = [];
  public leadWiseBooking: any = [];
  public filterStatus: any = [];
  public isLoading: boolean = true;
  public loading: boolean = true;
  public empDetailModel: any = {};
  public byStatusModel: any = {};
  public leadAnalysisDetailsReportList: any[] = [];
  public PreferredProjectInfo: any = [];
  public isPopUpLoading: boolean = false;
  public getAllLeadDetailsSubscription: Subscription;
  public getLeadAnalysisDetailsReportSubscription: Subscription;
  public projectListSubscription: Subscription;
  public SitevisitReportDetailsSubscription: Subscription;
  public j1: any;
  public testBookings: number;
  public testSiteVisitScheduled: number;
  public testSiteVisitConducted: number;
  public p: number = 1;
  public q: number = 1;
  public j: number = 1;
  public salesStatusInfo: any = [
    { key: "new", value: "New" },
    { key: "warm", value: "Warm" },
    { key: "hot", value: "Hot" },
    { key: "contactestablish", value: "ContactEstablish" },
    { key: "sitevisitscheduled", value: "SiteVisitScheduled" },
    { key: "sitevisitdone", value: "SiteVisitDone" },
    { key: "negotiation", value: "Negotiation" },
    { key: "booked", value: "Booked" },
    { key: "cold", value: "Cold" },
    { key: "unqualified", value: "Unqualified" },
    { key: "lost", value: "Lost" },
    { key: "assignedtopresales", value: "AssignedtoPresales" },
    { key: "incoming", value: "Incoming" },
    { key: "prospect", value: "Prospect" },
    { key: "opportunity", value: "Opportunity" },
    { key: "approved", value: "Approved" },
    { key: "loandocumentpending", value: "LoanDocumentPending" },
    { key: "closed", value: "Closed" }];
  public presalesStatusInfo: any = [
    { key: "incoming", value: "Incoming" },
    { key: "prospect", value: "Prospect" },
    { key: "warm", value: "Warm" },
    { key: "hot", value: "Hot" },
    { key: "cold", value: "Cold" },
    { key: "unqualified", value: "Unqualified" },
    { key: "lost", value: "Lost" }];
  public sitevisitReport: boolean = false;

  constructor(private empReportService: EmpReportService,
    private excelService: ExcelService,
    private router: Router, private preSalesLeadsService: PreSalesLeadsService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getallLeadDetails(this.byStatusModel);
        this.getLeadwiseBookingDetails(this.byStatusModel);
        this.GetProjectNameList();
        this.filterStatus = (this.loggedInuserDetails.Role !== 5 && this.loggedInuserDetails.Role !== 11) ? this.salesStatusInfo : this.filterStatus;
        this.filterStatus = (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 11) ? this.presalesStatusInfo : this.filterStatus;
        this.byStatusModel.ProjectId = "";
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    //-----if date range change-----//
    if (changes && this.dateObj) {
      this.selectedDateRange = this.dateObj;
      if (this.loggedInuserDetails && this.loggedInuserDetails !== '') {
        this.getallLeadDetails(this.byStatusModel);
        this.getLeadwiseBookingDetails(this.byStatusModel);
      }
    }
    //-----End-----//
  }
  getallLeadDetails = (ProjectId) => {
    //-----service call to get data-----//
    this.selectedDateRange['ProjectId'] = ProjectId ? ProjectId : null;
    this.isLoading = true;
    this.getAllLeadDetailsSubscription = this.empReportService.getAllLeadDetails(this.loggedInuserDetails, 'ByStatus', this.selectedDateRange).subscribe((response) => {
      if (response && response['data'].length > 0) {
        this.getLeadByStatus = response['data'] ? response['data'] : [];
        this.getLeadByStatus.forEach(element => {
          let total = 0;
          let columnName = Object.keys(element);
          columnName.forEach(item => {
            let data = this.filterStatus.filter(x => x.key === item.toLocaleLowerCase());
            if (data.length > 0) {
              total += element[item] ? element[item] : 0;
            }
          });
          element['Total'] = total;
        });
        let TotalCount = [];
        TotalCount.push({ EmpName: 'total' });
        this.filterStatus.map(element => {
          let sum = 0;
          sum = this.getLeadByStatus.reduce((a, b) => +a + +b[element.value], 0);
          TotalCount[0][element.value] = sum;
        });
        this.getLeadByStatus.push(TotalCount[0]);
      }
      else {
        this.getLeadByStatus = [];
      }
      this.isLoading = false;
    });
    //-----End-----//
  }
  exportEvent = () => {
    //---this export the details in excel file---//
    if (this.getLeadByStatus && this.getLeadByStatus !== []) {
      this.excelService.exportAsExcelFile(this.getLeadByStatus, 'ExcelSheet');
    }
    //---end---//
  }
  export = () => {
    //---this export the details in excel file---//
    if (this.leadWiseBooking && this.leadWiseBooking !== []) {
      this.excelService.exportAsExcelFile(this.leadWiseBooking, 'ExcelSheet');
    }
    //---end---//
  }
  getLeadwiseBookingDetails = (ProjectId) => {
    //-------Get project wise SV & booking details-------//
    this.selectedDateRange['ProjectId'] = ProjectId ? ProjectId : null;
    this.loading = true;
    this.getAllLeadDetailsSubscription = this.empReportService.LeadWiseBookingDetails(this.loggedInuserDetails, this.selectedDateRange).subscribe((response) => {
      if (response && response['data'].length > 0) {
        this.leadWiseBooking = response['data'] ? response['data'] : [];
        let SiteVisitConducted = 0;
        let SiteVisitScheduled = 0;
        this.leadWiseBooking.forEach(element => {
          element.TotalCount = element.SiteVisitConducted + element.SiteVisitScheduled + element.Bookings;
          SiteVisitConducted = SiteVisitConducted + element.SiteVisitConducted;
          SiteVisitScheduled = SiteVisitScheduled + element.SiteVisitScheduled;
          this.testBookings = +element.Bookings;
        });
        this.testSiteVisitConducted = SiteVisitConducted;
        this.testSiteVisitScheduled = SiteVisitScheduled;
      } else {
        this.leadWiseBooking = [];
      }
      this.loading = false;
    });
  }

  GetProjectNameList = () => {
    //-------Get All Projects name-------//
    this.projectListSubscription = this.preSalesLeadsService.GetAllProjectName(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.PreferredProjectInfo = response["data"];
      }
    });
  }

  getReportDetails = (empModel, count: number, status: string, ProjectId) => {
    this.leadAnalysisDetailsReportList = [];
    if (empModel.EmpId && count > 0) {
      this.isPopUpLoading = true;
      this.showReportsDetailsModal.show();
      this.empDetailModel.EmpId = empModel.EmpId;
      this.empDetailModel.EmpName = empModel.EmpName;
      this.empDetailModel.ReportName = 'ByStatus';
      this.empDetailModel.FromDate = this.selectedDateRange.startDate.format('YYYY-MM-DD');
      this.empDetailModel.ToDate = this.selectedDateRange.endDate.format('YYYY-MM-DD');
      this.empDetailModel.Option = status;
      this.sitevisitReport = false;
      this.empDetailModel.ProjectId = ProjectId ? ProjectId : null;
      this.getLeadAnalysisDetailsReportSubscription = this.empReportService.getLeadAnalysisDetailsReport(this.loggedInuserDetails, this.empDetailModel).subscribe((response) => {
        if (response && response['data'].length > 0) {
          this.leadAnalysisDetailsReportList = response['data'];
        } else {
          this.leadAnalysisDetailsReportList = [];
        }
        this.isPopUpLoading = false;
      });
    }
  }
  SitevisitReportDetails = (empModel, count: number, status: string) => {
    this.leadAnalysisDetailsReportList = [];
    if (empModel.EmployeeId && count > 0) {
      this.isPopUpLoading = true;
      this.showReportsDetailsModal.show();
      this.empDetailModel.EmpId = empModel.EmployeeId;
      this.empDetailModel.EmpName = empModel.Name;
      this.empDetailModel.ReportName = 'ByStatus';
      this.empDetailModel.FromDate = this.selectedDateRange.startDate.format('YYYY-MM-DD');
      this.empDetailModel.ToDate = this.selectedDateRange.endDate.format('YYYY-MM-DD');
      this.empDetailModel.Option = status;
      this.sitevisitReport = true;
      this.SitevisitReportDetailsSubscription = this.empReportService.getSitevisitReportDetails(this.loggedInuserDetails, this.empDetailModel).subscribe((response) => {
        if (response && response['data'].length > 0) {
          this.leadAnalysisDetailsReportList = response['data'];
        } else {
          this.leadAnalysisDetailsReportList = [];
        }
        this.isPopUpLoading = false;
      });
    }
  }
  exportPopEvent = () => {
    //---this export the details in excel file---//
    if (this.leadAnalysisDetailsReportList && this.leadAnalysisDetailsReportList !== []) {
      this.excelService.exportAsExcelFile(this.leadAnalysisDetailsReportList, 'ExcelSheet');
    }
    //---end---//
  }
  close() {
    this.showReportsDetailsModal.hide()
  }
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.close();
    }
  }
  ngOnDestroy() {
    this.getAllLeadDetailsSubscription ? this.getAllLeadDetailsSubscription.unsubscribe() : null;
    this.getLeadAnalysisDetailsReportSubscription ? this.getLeadAnalysisDetailsReportSubscription.unsubscribe() : null;
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
}
