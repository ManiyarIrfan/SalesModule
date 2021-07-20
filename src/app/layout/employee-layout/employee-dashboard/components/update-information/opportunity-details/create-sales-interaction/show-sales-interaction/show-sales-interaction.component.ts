import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { SalesLeadDetailsService } from 'src/app/shared/services/employee/sales-lead-details.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';


@Component({
  selector: 'tru-show-sales-interaction',
  templateUrl: './show-sales-interaction.component.html',
  styleUrls: ['./show-sales-interaction.component.scss']
})
export class ShowSalesInteractionComponent implements OnInit, OnDestroy {
  public arrString: string[] = [];
  public EnteredBy: string[] = [];
  public interactionData: string[] = [];
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public enquiryDetails: string;
  public usertype: string = "Enquiry";
  public callDetails: string[] = [];
  public smsDetails: string[] = [];
  public interactionModel: string[] = [];
  public p1: number;
  public testinteractionModel: string[] = [];
  public interactionFilter: string = '';
  public interactionTypes: any = [
    { key: "Note", value: "Note" },
    { key: "FollowUp Scheduled", value: "FollowUp Scheduled" },
    { key: "Site Visit Updated", value: "SiteVisit Updated" },
    { key: "Site Visit Schedule", value: "SiteVisit Schedule" },
    { key: "Site Visit Conducted", value: "Site Visit Conducted" },
    { key: "Presales Reassign", value: "Presales Reassign" },
    { key: "Email", value: "Email" }];

  @Input() interactionDetails: any = [];

  private _EventSubscription: Array<Subscription> = [];

  constructor(private sharedService: SharedService,
    private salesLeadDetailsService: SalesLeadDetailsService) { }

  ngOnInit() {
    //  if (localStorage.getItem('LoggedinUser')) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    //  }
    this.sharedService.changeSalesInteractionListener.subscribe(() => {
      this.getInteraction();
      this.showSmsDetails();
      this.interactionFilter = "";
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    //  if (localStorage.getItem('LoggedinUser')) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (changes.interactionDetails && this.interactionDetails) {
      this.getInteraction();
      this.showCallDetails();
      this.showSmsDetails();
      this.interactionFilter = "";
    }
    // }
  }
  getInteraction = () => {
    //-------Show Interaction Details-------//
    if (this.interactionDetails != undefined && this.interactionDetails != 0) {
      const salesLeadDetailsServiceSub = this.salesLeadDetailsService.getInteractionDetails(this.loggedInuserDetails, this.interactionDetails).subscribe((response) => {
        if (response && response["data"]) {
          this.testinteractionModel = this.interactionModel = response["data"];
        }
      });
      this._EventSubscription.push(salesLeadDetailsServiceSub);
    }
    //-------End-------//
  }

  filterOnInteraction = (interactionFilter) => {
    if (interactionFilter) {
      this.interactionModel = this.testinteractionModel.filter(x => x['InteractionType'].toLowerCase().indexOf(interactionFilter.toLowerCase()) !== -1);
    } else {
      this.interactionModel = this.testinteractionModel;
    }
  }

  showCallDetails = () => {
    //-------Show Call Details-------//
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      const getCallDetailsSub = this.salesLeadDetailsService.getCallDetails(this.loggedInuserDetails, this.interactionDetails).subscribe((response) => {
        if (response && response["data"]) {
          this.callDetails = response["data"];
        }
      });
      this._EventSubscription.push(getCallDetailsSub);
    }
    //-------End-------//
  }
  showSmsDetails = () => {
    //-------Show Sms Details-------//
    const getSmsDetailsSub = this.salesLeadDetailsService.getSmsDetails(this.loggedInuserDetails, this.interactionDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.smsDetails = response["data"];
      }
    });
    this._EventSubscription.push(getSmsDetailsSub);
    //-------End-------//
  }
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