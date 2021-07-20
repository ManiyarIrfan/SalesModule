import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
@Component({
  selector: 'tru-sub-tab-lead-byproject',
  templateUrl: './sub-tab-lead-byproject.component.html',
  styleUrls: ['./sub-tab-lead-byproject.component.scss']
})
export class SubTabLeadByprojectComponent implements OnInit, OnChanges, OnDestroy {
  public empDetailModel: any = {};
  public leadAnalysisDetailsReportList: any = [];
  public loggedInuserDetails: any;
  public selectedDateRange: any;
  public getLeadByStatus: any = [];
  public isLoading: boolean = true;
  public tableHeader: any = [];
  public isPopUpLoading: boolean = false;
  public j: number;
  public p1: number;
  public getAllLeadDetailsSubscription: Subscription;

  @ViewChild('showReportsDetailsModal', { static: false }) public showReportsDetailsModal: ModalDirective;
  @Input() dateObj: any;

  constructor(
    private empReportService: EmpReportService,
    private excelService: ExcelService,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getallLeadDetails();
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
        this.getallLeadDetails();
      }
    }
  }

  getLeadDetail = (data, count: number, heading) => {
    this.leadAnalysisDetailsReportList = [];
    if (data.EmpId && count > 0) {
      this.empDetailModel["ReportName"] = 'ByProject';
      this.empDetailModel["Option"] = heading;
      this.empDetailModel["FromDate"] = this.selectedDateRange.startDate.format('YYYY-MM-DD');
      this.empDetailModel["ToDate"] = this.selectedDateRange.endDate.format('YYYY-MM-DD');
      this.empDetailModel["EmpId"] = data.EmpId;
      this.empDetailModel.EmpName = data["EmpName"];
      this.showReportsDetailsModal.show();
      this.empReportService.getLeadAnalysisDetailsReport(this.loggedInuserDetails, this.empDetailModel).subscribe((response) => {
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
  }
  getallLeadDetails = () => {
    //-----service call to get data-----//
    this.isLoading = true;
    this.getAllLeadDetailsSubscription = this.empReportService.getAllLeadDetails(this.loggedInuserDetails, 'ByProject', this.selectedDateRange).subscribe((response) => {
      if (response && response['data'] && response['data'].length > 0) {
        this.getLeadByStatus = response['data'] ? response['data'] : [];
        this.tableHeader = Object.keys(response['data'][0]);
        let index = this.tableHeader.findIndex(x => x.toLocaleLowerCase() === 'empname');
        index !== -1 ? this.tableHeader.splice(index, 1) : null;
        this.getLeadByStatus.forEach(element => {
          let total = 0;
          this.tableHeader.forEach((item, index) => {
            if (item.toLocaleLowerCase() !== 'empid' && item.toLocaleLowerCase() !== 'empname') {
              element[item] = element[item] ? element[item] : 0;
              total += element[item] ? element[item] : 0;
            } else {
              item.toLocaleLowerCase() === 'empid' ? this.tableHeader.splice(index, 1) : null;
            }
          });
          element['Total'] = total;
        });
      }
      else {
        this.getLeadByStatus = [];
      }
      this.isLoading = false;
    });
  }
  exportEvent() {
    //---this export the details in excel file---//
    if (this.getLeadByStatus && this.getLeadByStatus !== []) {
      this.excelService.exportAsExcelFile(this.getLeadByStatus, 'ExcelSheet');
    }
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.close();
    }
  }
//**************Close Model*******//
  close() {
    this.showReportsDetailsModal.hide()
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  ngOnDestroy() {
    this.getAllLeadDetailsSubscription ? this.getAllLeadDetailsSubscription.unsubscribe() : null;
  }
}
