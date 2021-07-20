import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import * as c3 from "c3";
import { EmpReportService } from "src/app/shared/services/employee/emp-report.service";

@Component({
  selector: "tru-split-bar-chart",
  templateUrl: "./split-bar-chart.component.html",
  styleUrls: ["./split-bar-chart.component.scss"],
})
export class SplitBarChartComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() chartValues: any;
  @Input() id: any;
  // @ViewChild('showDetailReportModel')
  // public showDetailReportModel: ModalDirective;
  public loggedInuserDetails: any;
  public page: number = 1;
  public barLength: number;
  public barData: any;
  public viewdata: any;
  public chartId: string;
  public from: any;
  public to: any;
  public name: string;
  public SelectedDateRange: any;
  public chart: c3;
  public showReportDetails: any = [];
  public tableColumn: any = [];
  public param: any;
  public exceptionMsg: boolean = false;
  public statusArray: any = [];
  public termstatus: any;
  public totalLeadCount: number;
  constructor(
    public router: Router,
    private empReportService: EmpReportService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("LoggedinUser")) {
      this.loggedInuserDetails = JSON.parse(
        localStorage.getItem("LoggedinUser")
      );
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.chartValues) {
      this.InitiateBarCart(this.chartValues);
    }
  }
  ngAfterViewInit() {
    this.InitiateBarCart(this.chartValues);
  }
  prepareSplitChart = (viewdata, catagories) => {
    this.barLength = this.chartValues.response.length;

    // ********** if Channel partner Report *********** //
    if (this.id == "Cpreport") {
      this.chart = c3.generate({
        bindto: "#chart" + this.id,
        data: {
          type: "bar",
          json: viewdata,
          groups: [catagories],
          keys: {
            x: this.chartValues.name,
            value: catagories,
          },
        },
        axis: {
          x: {
            type: "category",
            onmouseover: function (d, i) {},
            onmouseout: function (d, i) {},
          },
        },
        size: {
          height: 400,
          width: 1100,
        },
        bar: {
          width: {
            ratio: 0.5,
          },
        },
      });
    }
    // ********** End *********** //
    // ********** if Employee Report *********** //
    else {
      this.chart = c3.generate({
        bindto: "#chart" + this.id,
        data: {
          type: "bar",
          json: viewdata,
          groups: [catagories],
          keys: {
            x: this.chartValues.name,
            value: catagories,
          },
          // onclick: (d, element) => { this.showDetail(d, element); },
        },
        axis: {
          x: {
            type: "category",
            onmouseover: function (d, i) {},
            onmouseout: function (d, i) {},
          },
        },
        size: {
          height: 400,
          width: 1250,
        },
        bar: {
          width: {
            ratio: 0.5,
          },
        },
      });
    }
    // ********** End *********** //
  };
  InitiateBarCart(chartValues) {
    if (chartValues) {
      let data = chartValues.response;
      this.barLength = (data && data.length) || null;
      this.viewdata = data.slice(this.page - 1, this.page + 9);
      this.prepareSplitChart(this.viewdata, this.chartValues.value);
    }
  }
  nextClick() {
    if (this.page + 9 < this.barLength) {
      this.page++;
      let data = this.chartValues.response;
      this.viewdata = data.slice(this.page, this.page + 9);
      this.prepareSplitChart(this.viewdata, this.chartValues.value);
    }
  }
  previousClick() {
    if (this.page > 1) {
      if (this.page === this.barLength - 9) this.page--;
      this.page--;
      this.viewdata = this.chartValues.response.slice(this.page, this.page + 9);
      this.prepareSplitChart(this.viewdata, this.chartValues.value);
    }
  }
  // showDetail = (d, i) => {
  //   this.param = this.chartValues.response[d.index][this.chartValues.parameter];
  //   this.from = this.chartValues.dateRange.startDate.format('YYYY-MM-DD');
  //   this.to = this.chartValues.dateRange.endDate.format('YYYY-MM-DD');
  //   this.statusArray = this.chartValues.value;
  //   this.termstatus = "";
  //   this.showDetailReportModel.show();
  //   if (this.chartValues.tab === 'salesTab') {
  //     this.name = this.chartValues.response[d.index].SaleEmpName;
  //     this.empReportService.GetReportForPipelineAnalysisDetails(this.loggedInuserDetails, this.chartValues.dateRange, this.chartValues.reportName, this.chartValues.subReportName, this.param).subscribe((response) => {
  //       if (response && response.data[0].length > 0) {
  //         this.showReportDetails = response.data[0];
  //         this.tableColumn = Object.keys(response.data[0][0]);
  //         this.totalLeadCount = response.data[0].length;
  //         this.exceptionMsg = false;
  //       } else {
  //         this.exceptionMsg = true;
  //       }
  //     });
  //   }
  //   if (this.chartValues.tab === 'presalesTab') {
  //     this.empReportService.GetReportForPipelineAnalysisDetails(this.loggedInuserDetails, this.chartValues.dateRange, this.chartValues.reportName, this.chartValues.subReportName, this.param).subscribe((response) => {
  //       if (response && response.data[1].length > 0) {
  //         this.showReportDetails = response.data[1];
  //         this.tableColumn = Object.keys(response.data[1][0]);
  //         this.totalLeadCount = response.data[1].length;
  //         this.name = "Presales";
  //         this.exceptionMsg = false;
  //       } else {
  //         this.exceptionMsg = true;
  //       }
  //     });
  //   }
  // }
  // onClose = () => {
  //   this.showDetailReportModel.hide();
  // }
}
