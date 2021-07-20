import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tru-sub-tab-call-sales-perform',
  templateUrl: './sub-tab-call-sales-perform.component.html',
  styleUrls: ['./sub-tab-call-sales-perform.component.scss']
})
export class SubTabCallSalesPerformComponent implements OnInit {
  // Declare Variables
  @Input() dateObj: any;// get Date for passing input to other component
  public SelectedDateRange: any;
  public loggedInuserDetails: any
  public Subreport: any = [
    { key: "Sales", value: "Sales" },
    { key: "PreSales", value: "PreSales" }
  ];
  constructor(public router: Router) { }
  ngOnInit() {
  }
}
