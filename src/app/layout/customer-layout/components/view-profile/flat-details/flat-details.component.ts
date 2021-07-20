import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import {IcustModel, IprojectFlatDetails } from 'src/app/shared/models/Customer/view-profile.model';

@Component({
  selector: 'tru-flat-details',
  templateUrl: './flat-details.component.html',
  styleUrls: ['./flat-details.component.scss']
})
export class FlatDetailsComponent implements OnChanges {
  @Input() projectFlatDetails:IprojectFlatDetails=<IprojectFlatDetails>{};
  @Input() index: number;
  public custModel:IcustModel=<IcustModel>{};
  public Longitude: any;
  public Latitude: any;
  public isCollapsed = false;
  public opened: Boolean = false;
  constructor() { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.projectFlatDetails && this.projectFlatDetails) {
      this.custModel['custProject'] = this.projectFlatDetails.ProjectName;
      this.custModel['custBHK'] = this.projectFlatDetails.BHK;
      this.custModel['custTower'] = this.projectFlatDetails.BuildingType;
      this.custModel['custType'] = this.projectFlatDetails.FlatType;
      this.custModel['custFlat'] = this.projectFlatDetails.FlatNo;
      this.Longitude = this.projectFlatDetails.Longitude;
      this.Latitude = this.projectFlatDetails.Latitude;
    }
  }
  openfile = (file) => {
    window.open(file);
  }
  toggle = () => {
    this.opened = !this.opened;
  }
}
