import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers-community',
  templateUrl: './customers-community.component.html',
  styleUrls: ['./customers-community.component.scss']
})
export class CustomersCommunityComponent implements OnInit {
  public backgroudHeader = '../../../../../assets/community/1.jpg';

  constructor() { }

  ngOnInit() {
  }

  // Get Event Image URL
  getBackground() {
    return { 'background-image': `url(${this.backgroudHeader}` };
  }
}
