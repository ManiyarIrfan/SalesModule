import { Component, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
@Component({
  selector: 'tru-ambar-charts',
  templateUrl: './ambar-charts.component.html',
  styleUrls: ['./ambar-charts.component.scss']
})
export class AmbarChartsComponent implements OnChanges, OnDestroy {
  @ViewChild('showDetailReportModel', { static: false }) public showDetailReportModel: ModalDirective;
  @Input() data: any;
  @Input() barChartid: string;
  public loggedInuserDetails: any;
  //public chart: AmChart;
  public showReportDetails: any;
  public tableColumn: any = [];
  public totalLeadCount: number;
  public exceptionMsg: boolean;
  public termstatus: string;
  public getEnquiryDetails: any;
  public enquiryCount: number;
  public date: any = {};
  public p: number;

  constructor(
    // private AmCharts: AmChartsService, 
    private empReportService: EmpReportService, 
    private excelService: ExcelService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    //---If Input data change---//
    // if (changes['data'] && this.data) {
    //   this.plotbarChart();
    // }
    //---end---//
  }
  //---this is for display Am bar charts---//
  // plotbarChart = () => {
  //   this.chart = this.AmCharts.makeChart("chartdiv" + this.barChartid, {
  //     "type": "serial",
  //     "theme": "none",
  //     "dataProvider": this.data.response,
  //     "valueAxes": [{
  //       "gridColor": "#FFFFFF",
  //       "gridAlpha": 0.2,
  //       "dashLength": 0,
  //     }],
  //     "gridAboveGraphs": true,
  //     "startDuration": 1,
  //     "graphs": [{
  //       "balloonText": "[[category]]: <b>[[value]]</b>",
  //       "fillAlphas": 0.8,
  //       "lineAlpha": 0.2,
  //       "type": "column",
  //       "valueField": "value"
  //     }],
  //     "chartCursor": {
  //       "categoryBalloonEnabled": false,
  //       "cursorAlpha": 0,
  //       "zoomable": false
  //     },
  //     "categoryField": "key",
  //     "categoryAxis": {
  //       "gridPosition": "start",
  //       "gridAlpha": 0,
  //       "tickPosition": "start",
  //       "tickLength": 20
  //     },
  //     "export": {
  //       "enabled": true
  //     },
  //     "listeners": [
  //       {
  //         "event": "clickGraph",
  //         "method": this.showDetails
  //       }],
  //   });
  // }
  //---end---//
  showDetails = (event) => {
    //---popup to show details about perticular report ---//
    this.showDetailReportModel.show();
    if (this.data.allDetails != [] && this.data.allDetails.length > 0) {
      this.totalLeadCount = this.data.allDetails.length;
      this.date = this.data.dateRange;
      this.termstatus = event.graph.currentDataItem.category;
      this.tableColumn = Object.keys(this.data.allDetails[0])
      let test = this.data.allDetails.filter(x => x.CurrentStatus.toLowerCase() === this.termstatus.toLowerCase());
      if (test.length > 0) {
        this.showReportDetails = test;
        this.enquiryCount = test.length;
        this.exceptionMsg = false;
      } else {
        this.exceptionMsg = true;
      }
    }
    //---end---//
  }
  onClose = () => {
    //---close popup---//
    this.showDetailReportModel.hide();
    this.termstatus = '';
    this.showReportDetails = [];
    //---end---//
  }
  ngOnDestroy() {
    //---distroy charts if any changes occured and prepare for new---//
    // if (this.chart) {
    //   this.AmCharts.destroyChart(this.chart);
    // }
    //---end---//
  }
  print() {
    //---this show the print functionality ---//
    window.print();
    //---end---//
  }
  exportEvent() {
    //---this export the details in excel file---//
    if (this.showReportDetails != null && this.showReportDetails != undefined) {
      this.excelService.exportAsExcelFile(this.showReportDetails, 'ExcelSheet');
    }
    //---end---//
  }
}
