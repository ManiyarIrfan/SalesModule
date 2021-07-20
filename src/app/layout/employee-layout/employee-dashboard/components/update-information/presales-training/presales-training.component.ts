import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IgetDetails } from 'src/app/shared/models/employeeModel/Presales-traning.model';

@Component({
  selector: 'tru-presales-training',
  templateUrl: './presales-training.component.html',
  styleUrls: ['./presales-training.component.scss']
})
export class PresalesTrainingComponent implements OnInit, OnDestroy {
  public notFound: string = '';
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public getDetails: object[] = [];
  public isShow: boolean = false;

  public _EventSubscription: Array<Subscription> = [];
  constructor(public sharedService: SharedService, public router: Router) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    const getFileDetailsSubscription = this.sharedService.getFileDetailServices(this.loggedInuserDetails, 'Presales Training Video').subscribe((response) => {
      if (response["successful"] && response["data"] && response["data"][0].length > 0) {
        this.getDetails = response["data"][0];
      } else {
        this.notFound = 'No Data Found';
      }
      this._EventSubscription.push(getFileDetailsSubscription);
    });
  }
  //*************display selected video************//
  openVideo = (URL) => {
    this.getDetails['displayURL'] = URL.FileURL ? URL.FileURL : null;
    this.getDetails['Name'] = URL.DocName ? URL.DocName : null;
    this.isShow = true;
  }
  //*************go to back screen************//
  onback = () => {
    this.getDetails['displayURL'] = null;
    this.getDetails['Name'] = null;
    this.isShow = false;
  }
  //********** Used for NgFor to unique Id Everytym **********//
  trackByFn = (item) => {
    return item.id; // unique id corresponding to the item
  }
  //** action for ng On Destroy  **/
  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}
