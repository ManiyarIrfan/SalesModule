import { Component, OnInit, Input, SimpleChanges, Output, ViewChild, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';

@Component({
  selector: 'tru-sub-tab-enquiry-untouched-analysis',
  templateUrl: './sub-tab-enquiry-untouched-analysis.component.html',
  styleUrls: ['./sub-tab-enquiry-untouched-analysis.component.scss']
})
export class SubTabEnquiryUntouchedAnalysisComponent implements OnInit, OnDestroy { 
  public selectedDateRange: any;
  public loggedInuserDetails: any;
  public getUntouchedCount: any = [];
  public getUntouchedDetail: any = [];
  public TotalEnquiry: any = [];
  public empModelDetails: any = {};
  public getUntouchedCountSubscription: Subscription;
  public getUntouchedDetailSubscription: Subscription;
  public isLoading: boolean = false;
  public PopUpLoading: boolean = false;
  public p1: number;
  public q1: number;
  public t1: number;

  @Output() emitEvent = new EventEmitter<any>();
  @Input() dateObj: any;
  @ViewChild('popupUntouchedDetailModel', { static: false }) public popupUntouchedDetailModel: ModalDirective;

  constructor(  
    private excelService: ExcelService,
    private empService: EmpReportService,
    private sharedService: SharedService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails && this.loggedInuserDetails !== '') {
        this.getUntouchedAnalysis();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //-----if date range change-----//
    if (changes && this.dateObj) {
      this.selectedDateRange = this.dateObj;
      if (this.loggedInuserDetails) {
        this.getUntouchedAnalysis();
      }
    }  
  }

  //********************* Total Untouched Enquiry Analysis Count within Date Range *******************//
  getUntouchedAnalysis = () => {
    this.isLoading = true;
    this.getUntouchedCountSubscription = this.empService.getUntouchedAnalysis(this.loggedInuserDetails, this.selectedDateRange).subscribe((response) => {
      this.getUntouchedCount = (response && response['data'] && response['data'].length > 0) ? response['data'] : [];
      this.TotalEnquiry = [];
      this.isLoading = false;
    });
  }

  //********************* Total Untouched Enquiry Analysis Count within Date Range *******************//
  getUntouchedAnalysisDetail = (empModel, Input: string) => {
    this.empModelDetails.Input = Input;
    this.empModelDetails.EmployeeId = empModel.EmployeeId;
    this.popupUntouchedDetailModel.show();
    this.TotalEnquiry = [];
    this.PopUpLoading = true;
    this.getUntouchedDetailSubscription = this.empService.getUntouchedAnalysisDetail(this.loggedInuserDetails, this.empModelDetails, this.selectedDateRange).subscribe((response) => {
      this.getUntouchedDetail = (response && response['data'] && response['data'].length > 0) ? response['data'] : [];
      this.PopUpLoading = false;
    });
  }
  // ********* Get Total EnquiryId ************* //
  getTotalEnquiry = () => {
    this.getUntouchedDetail.forEach(element => {
      this.TotalEnquiry.push(element.EnquiryId);
    });
  }
  // ********* Shared Service to go to Enquiry Details ************* //
  showDetails = (details) => {
    this.getTotalEnquiry();
    details.id = details.EnquiryId;
    details.enqId = this.TotalEnquiry;
    const tab14 = `tab14`;
    details.tabNo = tab14;
    details.id ? this.sharedService.allLeadSearchDetails(details) : null;
  }

  close() {
    this.popupUntouchedDetailModel.hide();
  }
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.close();
    }
  }
  // *********************** Export Excel Sheet For Untouched Enquiry Report And Detail *****************//
  exportEvent(input: string) {
    //---this export the details in excel file---//
    if (input === "reportDetail") {
      if (this.getUntouchedDetail && this.getUntouchedDetail !== []) {
        this.excelService.exportAsExcelFile(this.getUntouchedDetail, 'ExcelSheet');
      }
    }
    else {
      if (this.getUntouchedCount && this.getUntouchedCount !== []) {
        this.excelService.exportAsExcelFile(this.getUntouchedCount, 'ExcelSheet');
      }
    }
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  //****************Destroy subscription of Untouched Enquiry Analysis services*******************//
  ngOnDestroy() {
    this.getUntouchedCountSubscription ? this.getUntouchedCountSubscription.unsubscribe() : null;
    this.getUntouchedDetailSubscription ? this.getUntouchedDetailSubscription.unsubscribe() : null;
  }

}
