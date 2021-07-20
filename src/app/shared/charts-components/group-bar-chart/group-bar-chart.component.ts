import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import * as c3 from "c3";

@Component({
  selector: "tru-group-bar-chart",
  templateUrl: "./group-bar-chart.component.html",
  styleUrls: ["./group-bar-chart.component.scss"],
})
export class GroupBarChartComponent implements OnInit, OnChanges {
  @Input() Value: any;
  @Input() id: any;
  public loggedInuserDetails: any;
  public chartName: string;
  public barLength: any;
  public viewdata: any;
  public page: number = 1;
  public chart: any;
  constructor(public router: Router) {}
  ngOnInit() {
    if (localStorage.getItem("LoggedinUser")) {
      this.loggedInuserDetails = JSON.parse(
        localStorage.getItem("LoggedinUser")
      );
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    //---if input data change then display graph ---//
    if (changes && this.Value) {
      this.InitiateBarCart(this.Value);
    }
    //---end---//
  }
  ngAfterViewInit() {
    //---once data ready to view ---//
    this.InitiateBarCart(this.Value);
    //---end---//
  }
  DisplayBarChart = (viewdata, categories) => {
    //---display grapg---//
    this.barLength = this.Value.response.length;
    this.chart = c3.generate({
      bindto: "#" + this.id,
      data: {
        type: "bar",
        json: viewdata,
        keys: {
          x: this.Value.name, // it's possible to specify 'x' when category axis
          value: categories,
        },
      },
      axis: {
        x: {
          height: 100,
          extent: [5, 10],
          type: "category",
        },
      },

      size: {
        height: 600,
        width: 1275,
      },
      bar: {
        width: {
          ratio: 0.4,
        },
      },
    });
    //---end---//
  };
  InitiateBarCart(chartValues) {
    //---its display only 10 record of response---//
    if (chartValues) {
      let data = chartValues.response;
      this.barLength = (data && data.length) || null;
      this.viewdata = data.slice(this.page - 1, this.page + 9);
      this.DisplayBarChart(this.viewdata, this.Value.value);
    }
    //---end---//
  }
  nextClick() {
    //---its display next 10 record of response---//
    if (this.page + 9 < this.barLength) {
      this.page++;
      let data = this.Value.response;
      this.viewdata = data.slice(this.page, this.page + 9);
      this.DisplayBarChart(this.viewdata, this.Value.value);
    }
    //---end---//
  }
  previousClick() {
    //---its display previous 10 record of response---//
    if (this.page > 1) {
      if (this.page === this.barLength - 9) this.page--;
      this.page--;
      this.viewdata = this.Value.response.slice(this.page, this.page + 9);
      this.DisplayBarChart(this.viewdata, this.Value.value);
    }
    //---end---//
  }
}
