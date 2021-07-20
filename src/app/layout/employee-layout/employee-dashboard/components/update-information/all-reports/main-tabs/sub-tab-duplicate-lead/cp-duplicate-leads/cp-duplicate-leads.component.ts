import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDownloadSendEmailModel } from 'src/app/shared/models/employeeModel/search-details.model';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'tru-cp-duplicate-leads',
  templateUrl: './cp-duplicate-leads.component.html',
  styleUrls: ['./cp-duplicate-leads.component.scss']
})
export class CpDuplicateLeadsComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: any;
  @Input() dateObj: any;// get Date for Getting Report data
  public DownloadSendEmailModel: IDownloadSendEmailModel = <IDownloadSendEmailModel>{};
  public allDuplicates: any = [];
  public duplicateSpinner: boolean = false;
  public DownloadButtonSpinner: boolean = false;
  public NoDataFoundMessage: string = '';
  public ReportModel: any = [];
  public AllReportNames: any = [];
  public enabledButtonExport: boolean;
  public SelectedDateRange: any;
  public ExcelReport: any = [];
  public ExcelReportSummary: any = [];
  public getHeader: string[] = [];
  public filterDataSet: string[] = [];
  public PreferredProjectInfo: string[] = [];
  public ExcelReportSummaryTotal: any = [];
  public NoDataFoundMsg: string;
  public p1: number;
  public ExcelReportAll: string[] = [];
  public reportList: string[] = [];
  public ReportTypeList: string[] = [];
  public ckeConfig: any;
  private _unSubscriptionList: Array<Subscription> = [];
  constructor(public router: Router,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private empReportService: EmpReportService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.duplicateRecords();
        this.ReportNames();
        this.GetPreferredProjectByArea('');
        this.ReportModel.ReportName = "";
        this.getTypeAction('EmailReports');
      } else {
        this.router.navigate(['/login']);
      }
      this.ckeConfig = {
        allowedContent: true,
        extraPlugins: 'divarea',
        forcePasteAsPlainText: false,
        removePlugins: 'elementspath',
        removeButtons: 'Save',
        toolbarGroups: [
          { "name": "basicstyles", "groups": ["basicstyles"] },
          { "name": "paragraph", "groups": ["list", "align"] },
          { "name": "insert", "groups": ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'] },
          { "name": "document", "groups": ["mode"] },
          { "name": "styles", "groups": ["styles"] },
          { "name": "colors" },
          { "name": "tools", "groups": ["Maximize"] }
        ]
      };
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    //************* On date change get Report data **************//
    if (changes && this.dateObj) {
      this.SelectedDateRange = this.dateObj;
      this.resetDownloadReportsTab();
    }
  }
  //************* End **************//
  duplicateRecords = () => {
    //-------To get response for Duplicate Leads-------//
    this.duplicateSpinner = true;
    const getDuplicateRecords = this.empReportService.getDuplicateRecords(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.duplicateSpinner = false;
        if (response['exception']) {
          this.NoDataFoundMessage = response['exception'];
        } else {
          this.allDuplicates = response["data"];
        }
      }
    })
    this._unSubscriptionList.push(getDuplicateRecords);
    //-------End-------//
  }
  onChange = (ProjectId) => {

  }
  GetPreferredProjectByArea = (PreferredAreaName) => {
    const empReportService = this.empReportService.GetProjectListOnSelectedLocation(this.loggedInuserDetails, PreferredAreaName).subscribe((response) => {
      if (response && response["data"]) {
        this.PreferredProjectInfo = response["data"];
      }
    });
    this._unSubscriptionList.push(empReportService);
  }
  resetDownloadReportsTab = () => {
    //-------To reset Report Download Tab-------//
    this.ReportModel.ReportName = "";
    this.NoDataFoundMsg = "";
    this.enabledButtonExport = false;
    this.DownloadButtonSpinner = false;
    //-------End-------//
  }
  ReportNames = () => {
    //-------To get response for Report Names-------//
    const empReportService = this.empReportService.getReportNames(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"][0] && response["data"][0].length > 0) {
        this.AllReportNames = response["data"][0];
      }
    })
    this._unSubscriptionList.push(empReportService);
    //-------End-------//
  }

  ExcelReports = (ReportName, ProjectId) => {
    // -------To get response for Excel Sheet-------//
    this.DownloadButtonSpinner = true;
    this.getHeader = this.ExcelReportAll = this.ExcelReport = [];
    if (ReportName !== "") {
      let Dates = [];
      Dates['StartDate'] = (this.SelectedDateRange && this.SelectedDateRange.startDate) ? this.SelectedDateRange.startDate._d.toDateString() : null;
      Dates['EndDate'] = (this.SelectedDateRange && this.SelectedDateRange.endDate) ? this.SelectedDateRange.endDate._d.toDateString() : null;
      const empReportService = this.empReportService.getExcelReport(this.loggedInuserDetails, ReportName, Dates, ProjectId).subscribe((response) => {
        if (response && response["data"][0] && response["data"][0].length > 0) {
          this.ExcelReportAll = response["data"][0];
          Object.assign(this.ExcelReport, this.ExcelReportAll);
          this.getHeader = response["data"][0] ? Object.keys(response["data"][0][0]) : [];
          this.ExcelReportSummary = response["data"][1];
          this.ExcelReportSummaryTotal = response["data"][2];
          this.enabledButtonExport = true;
          this.NoDataFoundMsg = "";
        } else {
          this.NoDataFoundMsg = "No Data Found For This Date Range";
          this.enabledButtonExport = false;
        }
        this.DownloadButtonSpinner = false;
      });
      this._unSubscriptionList.push(empReportService);
    }
    else {
      this.NoDataFoundMsg = "";
      this.DownloadButtonSpinner = false;
    }
    //-------End-------//
  }
  //** action for filter Report ata **//
  filterReportData() {
    let counter = 0;
    this.getHeader.map(element => {
      if (element && this.filterDataSet[element]) {
        let Dat = counter > 0 ? this.ExcelReport : this.ExcelReportAll;
        this.ExcelReport = Dat.filter(x => x[element] && x[element].toString().toLowerCase().indexOf(String(this.filterDataSet[element]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.ExcelReport = counter === 0 ? this.ExcelReportAll : this.ExcelReport;
  }
  //********* Export All Report Details *********//
  toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }
  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  exportAsExcelFile(): void {
    let AllSummaryData = [];
    AllSummaryData = this.ExcelReportSummary.concat(this.ExcelReportSummaryTotal);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ExcelReport);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(AllSummaryData);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'Summary');
    XLSX.writeFile(workbook, this.toExportFileName('ExcelSheet_Data'));
  }
  getReportTypeList = (Value) => {
    let IndexOfReport = this.reportList.findIndex(x => x['Value'] === Value);
    if (IndexOfReport != -1) {
      this.ReportTypeList = this.reportList[IndexOfReport]['SubType'] ? this.reportList[IndexOfReport]['SubType'].split('*#*') : [];
      this.ReportModel.ShowReportType = this.ReportTypeList && this.ReportTypeList.length > 0 ? true : false;
      if (this.ReportModel.ShowReportType === false) {
        this.getEmailReportsDataAction(this.ReportModel.ReportName, null);
      }
    }
  }
  //** action for get Type Action KeyType **//
  getTypeAction = (Input) => {
    let searchModel = [];
    this.spinner.show();
    searchModel['KeyType'] = Input;
    this.reportList = [];
    const SubscriptionGetTypesService = this.empReportService.getTypesService(this.loggedInuserDetails, searchModel).subscribe((response) => {
      if (response && response["data"]) {
        this.reportList = response["data"];
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    });
    this._unSubscriptionList.push(SubscriptionGetTypesService);
  }
  //** action for get Type Action KeyType **//
  getEmailReportsDataAction = (Action, ReportType) => {
    let searchModel = [];
    this.spinner.show();
    searchModel['Input'] = Action;
    searchModel['DateFrom'] = this.SelectedDateRange && this.SelectedDateRange.startDate ? this.SelectedDateRange.startDate._d.toDateString() : null;
    searchModel['DateTo'] = this.SelectedDateRange && this.SelectedDateRange.endDate ? this.SelectedDateRange.endDate._d.toDateString() : null;
    searchModel['SubInput'] = this.ReportModel.ReportType ? this.ReportModel.ReportType : null;
    const SubscriptionGetTypesService = this.empReportService.getEmailReportsService(this.loggedInuserDetails, searchModel).subscribe((response) => {
      if (response && response["data"] && response["data"][0].length > 0) {
        this.DownloadSendEmailModel.HtmlBody = response["data"];
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    });
    this._unSubscriptionList.push(SubscriptionGetTypesService);
  }
  SendEmail = () => {
    this.DownloadSendEmailModel.EmailId = this.loggedInuserDetails.UserEmail;    
    const SubscriptionGetTypesService = this.empReportService.DownloadSendEmail(this.loggedInuserDetails, this.DownloadSendEmailModel).subscribe((response) => {
      if (response && response["data"]) {
        this.snackBar.open('Email Sent Successfully', 'Close', { duration: 3000 });
        this.spinner.hide();
      } else {
        this.snackBar.open(response['exception'], 'Close', { duration: 3000 });
        this.spinner.hide();
      }
    });
    this._unSubscriptionList.push(SubscriptionGetTypesService);
  }
  //********* End *********//
  ngOnDestroy() {
    for (let item of this._unSubscriptionList) {
      item.unsubscribe();
    }
  }
}