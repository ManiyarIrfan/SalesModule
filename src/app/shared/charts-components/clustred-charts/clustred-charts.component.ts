import { Component, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { EmpReportService } from 'src/app/shared/services/employee/emp-report.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';

@Component({
  selector: 'tru-clustred-charts',
  templateUrl: './clustred-charts.component.html',
  styleUrls: ['./clustred-charts.component.scss']
})
export class ClustredChartsComponent implements OnChanges, OnDestroy {

  public loggedInuserDetails: any;
  //public chart: AmChart;
  public tableColumn: any = [];
  public totalEnquiryCount: number;
  public date: any = {};
  public showReportDetails: any;
  public enquiryCount: any;
  public exceptionMsg: boolean;
  public p: number;
  
  @Input() data: any;
  @Input() clusturdChartid: string;
  @ViewChild('showDetailModel', { static: false }) public showDetailModel: ModalDirective;


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
    //   this.plotClusturdChart();
    // }
    //---end---//
  }
  // plotClusturdChart = () => {
  //   //---this is for display Am bar charts---//
  //   this.chart = this.AmCharts.makeChart("chartdiv" + this.clusturdChartid, {
  //     "type": "serial",
  //     "theme": "light",
  //     "dataProvider": this.data.response,
  //     "categoryField": this.data.xAxis,
  //     "rotate": false,
  //     "startDuration": 1,
  //     "categoryAxis": {
  //       "labelRotation": 0,
  //       "gridPosition": "start",
  //       "position": "left",
  //       "autoGridCount": false,
  //     },
  //     "trendLines": [],
  //     "graphs": this.data.valueField,
  //     "chartScrollbar": {
  //       "autoGridCount": false,
  //       "scrollbarHeight": 10
  //     },
  //     "legend": {
  //       "align": "center",
  //       "position": "right",
  //       "markerType": "square",
  //       "right": 6,
  //       "labelText": "[[title]]",
  //       "valueText": "",
  //       "valueWidth": 80,
  //       "textClickEnabled": true,
  //       "rollOverColor": "blue",
  //       "fontSize": 13,
  //       "useGraphSettings": true
  //     },
  //     "guides": [],
  //     "allLabels": [],
  //     "balloon": {},
  //     "titles": [],
  //     "export": {
  //       "enabled": true
  //     },
  //     "listeners": [
  //       {
  //         //"event": "clickGraph",
  //         "event": "clickGraphItem",
  //         "method": this.showAllDetails
  //       }],
  //   });
  //   //---end---//
  // }
  showAllDetails = (event) => {
    //---popup to show details about perticular report ---//
    this.showDetailModel.show();
    if (this.data.allDetails != [] && this.data.allDetails.length > 0) {
      this.totalEnquiryCount = this.data.allDetails.length;
      this.date = this.data.dateRange;
      let termstatus = event.graph.title;
      let item = event.item.category;
      let columnName = this.data.xAxis;
      this.tableColumn = Object.keys(this.data.allDetails[0])
      let test = this.data.allDetails.filter(x => (x[columnName].toLowerCase() === item.toLowerCase()) && (x.CurrentStatus.toLowerCase() === termstatus.toLowerCase()));
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
    this.showDetailModel.hide();
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
