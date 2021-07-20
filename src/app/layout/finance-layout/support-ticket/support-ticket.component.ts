import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { ServiceRequestService } from 'src/app/shared/services/employee/service-request.service';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class SupportTicketComponent implements OnInit, OnDestroy {
  loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  showServiceRequest: string[] = [];
  searchtext: string = '';
  noDOc: string = '../../../../assets/images/nodoc.png';
  Flag: boolean;
  p1: number;

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(private srService: ServiceRequestService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getServiceRequest();
  }

  getServiceRequest = () => {
    const SRSub = this.srService.GetAllServiceRequest(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        this.showServiceRequest = response["data"];
      }
    });
    this._unsubscribeAll.push(SRSub);
  }

  createNew = () => {
    this.Flag = true;
  }

  getImage(item) {
    if (item.ImageUrl) {
      // item.ImageUrl = item.ImageUrl;
      item.TooltipDetails = '';
    } else {
      item.ImageUrl = this.noDOc
      item.TooltipDetails = 'No File Found';
    }
    return item
  }
  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    for (let item of this._unsubscribeAll) {
      item.unsubscribe();
    }
  }
}
