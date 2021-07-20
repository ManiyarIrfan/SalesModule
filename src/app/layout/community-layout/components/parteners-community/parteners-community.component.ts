import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parteners-community',
  templateUrl: './parteners-community.component.html',
  styleUrls: ['./parteners-community.component.scss']
})
export class PartenersCommunityComponent implements OnInit {
  public backgroudHeader = '../../../../../assets/community/1.jpg';
  constructor() { }

  ngOnInit() {
  }

  // Get Event Image URL
  getBackground() {
    return { 'background-image': `url(${this.backgroudHeader}` };
  }

}
