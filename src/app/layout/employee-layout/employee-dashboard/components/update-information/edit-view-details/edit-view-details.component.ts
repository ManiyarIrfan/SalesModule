import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchDetailsComponent } from './search-details/search-details.component';
@Component({
  selector: 'tru-edit-view-details',
  templateUrl: './edit-view-details.component.html',
  styleUrls: ['./edit-view-details.component.scss']
})

export class EditViewDetailsComponent implements OnInit {
  public isSpinnerActive: boolean = true;
  public isShowDetails: boolean = true;
  @ViewChild(SearchDetailsComponent, { static: false }) child;
  constructor() { }

  ngOnInit() {
    this.isSpinnerActive = false;
  }

  receiveMessage($event) {
    this.isShowDetails = $event;
  }
}