import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IgetDetails } from 'src/app/shared/models/channelpartner/cro-training.model';

@Component({
  selector: 'tru-cro-training',
  templateUrl: './cro-training.component.html',
  styleUrls: ['./cro-training.component.scss']
})
export class CroTrainingComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: IloggedInuserDetails[] = [];
  public URL: string;
  public notFound: string = '';
  public getDetails: IgetDetails = <IgetDetails>{};
  public isShow: boolean = false;
  public _EventSubscription: Array<Subscription> = [];
  constructor(public router: Router, public sharedService: SharedService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.URL = this.loggedInuserDetails['UserType'] === 'ChannelPartner' ? 'https://trushare.blob.core.windows.net/crovideos/CP Process Guide_New_17feb2020.pdf' : 'https://trushare.blob.core.windows.net/crovideos/CRO Handout_new_17feb2020.pdf';
      }
      const getFileDetailsSubscription = this.sharedService.getFileDetailServices(this.loggedInuserDetails, 'Cp/Cro Training Video').subscribe((response) => {
        if (response["successful"] && response["data"] && response["data"][0].length > 0) {
          this.getDetails = response["data"][0];
        } else {
          this.notFound = 'No Data Found';
        }
        this._EventSubscription.push(getFileDetailsSubscription);
      });
    } else {
      this.router.navigate(['/login']);
    }
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
