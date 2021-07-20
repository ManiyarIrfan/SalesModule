import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as c3 from "c3";
import * as d3 from "d3";
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
@Component({
  selector: 'tru-sub-tab-unqualified-leadanalysis',
  templateUrl: './sub-tab-unqualified-leadanalysis.component.html',
  styleUrls: ['./sub-tab-unqualified-leadanalysis.component.scss']
})
export class SubTabUnqualifiedLeadanalysisComponent implements OnInit {
  @Input() dateObj: any;
  public selectedDateRange: any;
  public loggedInuserDetails: any;
  public isLoading: boolean = false;
  public LeadDetails = [];
  public NoDataFoundMessage: string = '';
  public isPieChartLoading: boolean = false;

  constructor(
    public router: Router,
    private excelService: ExcelService,
    private empReportService: EmpReportService) { }
  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    }
    if (this.loggedInuserDetails && this.loggedInuserDetails !== '') {
      this.ExcelReports();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    //-----if date range change-----//
    if (changes && this.dateObj) {
      this.selectedDateRange = this.dateObj;
      if (this.loggedInuserDetails && this.loggedInuserDetails !== '') {
        this.ExcelReports();
      }
    }
    //-----End-----//
  }
  ExcelReports = () => {
    this.isLoading = true;
    let Dates = [];
    Dates['StartDate'] = (this.selectedDateRange && this.selectedDateRange.startDate) ? this.selectedDateRange.startDate._d.toDateString() : null;
    Dates['EndDate'] = (this.selectedDateRange && this.selectedDateRange.endDate) ? this.selectedDateRange.endDate._d.toDateString() : null;
    //-------To get response for Excel Sheet-------//
    this.empReportService.getExcelReport(this.loggedInuserDetails, "Unqualified Lead Analysis", Dates, null).subscribe((response) => {
      if (response && response["data"][0] && response["data"][0].length > 0) {
        this.LeadDetails = response["data"][0];
        let dataToBind = [];
        this.LeadDetails.forEach(element => {
          dataToBind.push([element.StatusChangeReason, element.Count]);
        });
        this.isLoading = false;
        c3.generate({
          bindto: '#piechart',
          data: {
            columns: dataToBind,
            type: 'pie',
            onclick: function (d, i) { },
            onmouseover: function (d, i) { },
            onmouseout: function (d, i) { }
          },
          tooltip: {
            format: {
              value: function (value, ratio, id) {
                var format = id === 'data1' ? d3.format(',') : d3.format('');
                return format(value);
              }
            }
          }
        });
      } else {
        this.LeadDetails = [];
      }
    })
    //-------End-------//
  }
  exportEvent() {
    //---this export the details in excel file---//
    if (this.LeadDetails && this.LeadDetails !== []) {
      this.excelService.exportAsExcelFile(this.LeadDetails, 'ExcelSheet');
    }
    //---end---//
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
}
