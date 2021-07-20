import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { Subscription } from 'rxjs';
import {IlistedProjects,IcustSearchModel,IpreferredLocationLists,IpreferredProjectLists,IpreferredBHKLists} from 'src/app/shared/models/Customer/view-profile.model';
import {IloggedInuserDetails} from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'tru-search-project',
  templateUrl: './search-project.component.html',
  styleUrls: ['./search-project.component.scss']
})
export class SearchProjectComponent implements OnInit {
  public showProjectNotFoundMessage: boolean = true;
  public listedProjects: IlistedProjects=<IlistedProjects>{};
  public loggedInuserDetails: IloggedInuserDetails=<IloggedInuserDetails>{};
  public custSearchModel: IcustSearchModel=<IcustSearchModel>{};
  public preferredLocationLists:object[]=[];
  public preferredProjectLists: IpreferredProjectLists=<IpreferredProjectLists>{};
  public preferredBHKLists: IpreferredBHKLists=<IpreferredBHKLists>{};
  public p1: string;


  public GetProjectListOnSelectedLocationSubscription:Subscription;
  public GetBHKDetailsOnSelectedProjectSubscription:Subscription;
  public GetSerarchedProjectDetailsSubscription:Subscription;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.customerService.GetPreferredLocation(this.loggedInuserDetails).subscribe((response) => {
          if (response["data"]) {
            this.preferredLocationLists = response["data"][0];
            if (this.preferredLocationLists && this.preferredLocationLists[0]) {
              this.custSearchModel.preferredLocation = this.preferredLocationLists[0]['Location'];
              this.GetSelectedProjectsListOnLocation();
            }
          }
        });
      }
    }
  }
  GetSelectedProjectsListOnLocation = () => {
    if (this.loggedInuserDetails) {
      this.GetProjectListOnSelectedLocationSubscription=this.customerService.GetProjectListOnSelectedLocation(this.loggedInuserDetails, this.custSearchModel.preferredLocation).subscribe((response) => {
        if (response["data"]) {
          this.preferredProjectLists = response['data'];
          if (this.preferredProjectLists && this.preferredProjectLists[0]) {
            this.custSearchModel['preferredProjects'] = this.preferredProjectLists[0].ProjectName;
            this.GetBHKDetailsOnProject();
          }
        }
      });
    }
  }
  GetBHKDetailsOnProject = () => {
    if (this.loggedInuserDetails) {
      this.GetBHKDetailsOnSelectedProjectSubscription=this.customerService.GetBHKDetailsOnSelectedProject(this.loggedInuserDetails, this.custSearchModel['preferredProjects']).subscribe((response) => {
        if (response["data"]) {
          this.preferredBHKLists = response["data"][0];
          if (this.preferredBHKLists && this.preferredBHKLists[0])
            this.custSearchModel['preferredBHK'] = this.preferredBHKLists[0].BHK;
        }
      });
    }
  }
  onChange(preferredLocation) {
    this.GetSelectedProjectsListOnLocation();
  }
  onProjectChange() {
    this.GetBHKDetailsOnProject();
  }
  onBHKChange(bhkValue) {
    this.custSearchModel['preferredBHK'] = bhkValue;
  }
  OnSerchBtnClick = () => {
    if (this.loggedInuserDetails) {
      this.GetSerarchedProjectDetailsSubscription=this.customerService.GetSerarchedProjectDetails(this.loggedInuserDetails, this.custSearchModel).subscribe((response) => {
        if (response && response['data'][0] && response['data'][0].length > 0) {
          this.listedProjects = response['data'][0];
          this.showProjectNotFoundMessage = true;
        } else {
          this.showProjectNotFoundMessage = false;
        }
      });
    }
  }
  trackByFn(item) {
    return item.id; // or item.id
  }
  ngOnDestroy()
  { 
     this.GetProjectListOnSelectedLocationSubscription ? this.GetProjectListOnSelectedLocationSubscription.unsubscribe():null;
     this.GetBHKDetailsOnSelectedProjectSubscription ? this.GetBHKDetailsOnSelectedProjectSubscription.unsubscribe():null;
     this.GetSerarchedProjectDetailsSubscription ? this.GetSerarchedProjectDetailsSubscription.unsubscribe():null;
  }
}
