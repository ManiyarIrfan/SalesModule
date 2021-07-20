import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import {IprojectDetails} from 'src/app/shared/models/Customer/project-status.model';

@Component({
  selector: 'tru-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnChanges {
  @Input() projectDetails:IprojectDetails=<IprojectDetails>{};
  @Input() index: number;
  public proModel: any = {};
  public isCollapsed = false;
  public opened: Boolean = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.projectDetails && this.projectDetails) {
      this.proModel.proName = this.projectDetails.ProjectName;
      this.proModel.buildNo = this.projectDetails.BuildingType;
      this.proModel.currStatus = this.projectDetails.CurrentStatus;
      this.proModel.estiDate = this.projectDetails.EstimationCompletionDate;
      this.proModel.planFlat = this.projectDetails.PlannedActivity;
      this.proModel.currPrice = this.projectDetails.CurrentPrice;
    }
  }
  toggle = () => {
    this.opened = !this.opened;
  }
}
