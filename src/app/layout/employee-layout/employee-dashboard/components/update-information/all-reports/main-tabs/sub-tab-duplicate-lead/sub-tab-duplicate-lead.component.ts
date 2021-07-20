import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'tru-sub-tab-duplicate-lead',
  templateUrl: './sub-tab-duplicate-lead.component.html',
  styleUrls: ['./sub-tab-duplicate-lead.component.scss']
})
export class SubTabDuplicateLeadComponent implements OnInit, OnChanges {
  //Declare variable
  @Input() dateObj: any;// Get date for passing to another Component

  constructor(public router: Router) { }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) { }
}