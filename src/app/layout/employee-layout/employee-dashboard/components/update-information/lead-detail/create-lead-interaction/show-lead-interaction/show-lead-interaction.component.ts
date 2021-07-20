import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { PreSalesleadDetailsService } from 'src/app/shared/services/employee/pre-saleslead-details.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { ItestinteractionModel } from 'src/app/shared/models/employeeModel/lead-detail.model';

@Component({
  selector: 'tru-show-lead-interaction',
  templateUrl: './show-lead-interaction.component.html',
  styleUrls: ['./show-lead-interaction.component.scss']
})
export class ShowLeadInteractionComponent implements OnInit, OnDestroy {
  @Input() interactionDetails: any = [];
  public interactionData: object[] = [];
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public enquiryDetails: object[] = [];
  public usertype: string = "Enquiry";
  public callDetails: object[] = [];
  public smsDetails: string[] = [];
  public EmailData: string[] = [];
  public testinteractionModel: ItestinteractionModel[] = [];
  public p1: number;
  public interactionTypes: any = [
    { key: "Note", value: "Note" },
    { key: "FollowUp Scheduled", value: "FollowUp Scheduled" },
    { key: "Site Visit Updated", value: "SiteVisit Updated" },
    { key: "Site Visit Schedule", value: "SiteVisit Schedule" },
    { key: "Site Visit Conducted", value: "Site Visit Conducted" },
    { key: "Presales Reassign", value: "Presales Reassign" },
    { key: "Email", value: "Email" }];
  public interactionFilter: string = '';

  private _EventSubscription: Array<Subscription> = [];
  constructor(
    private sharedService: SharedService,
    private preSalesleadDetailsService: PreSalesleadDetailsService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    const changePresalesIneractionSub = this.sharedService.changePresalesIneractionListener.subscribe((details) => {
      if (details != undefined && details != 0) {
        this.enquiryDetails = details;
      }
      this.getInteraction();
      this.showSmsDetails();
      this.interactionFilter = "";
    });
    this._EventSubscription.push(changePresalesIneractionSub);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.interactionDetails && this.interactionDetails) {
      this.enquiryDetails = this.interactionDetails;
      // this.enquiryDetails['UserType'] = this.usertype;
      this.showCallDetails();
      this.showSmsDetails();
      this.getInteraction();
      this.getEmailDetails("SearchLeadEmailId");
      this.interactionFilter = "";
    }
  }
  getInteraction = () => {
    if (this.enquiryDetails != undefined && this.enquiryDetails != null) {
      const getInteractionDetailsSub = this.preSalesleadDetailsService.getInteractionDetails(this.loggedInuserDetails, this.enquiryDetails).subscribe((response) => {
        if (response && response["data"]) {
          this.testinteractionModel = this.interactionData = response["data"];
        }
      });
      this._EventSubscription.push(getInteractionDetailsSub);
    }
  }
  filterOnInteraction = (interactionFilter) => {
    if (interactionFilter) {
      this.interactionData = this.testinteractionModel && this.testinteractionModel.filter(x => x.InteractionType && x.InteractionType.toLowerCase().indexOf(interactionFilter.toLowerCase()) !== -1);
    } else {
      this.interactionData = this.testinteractionModel;
    }
  }
  showCallDetails = () => {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    const getCallDetailsSub = this.preSalesleadDetailsService.getCallDetails(this.loggedInuserDetails, this.enquiryDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.callDetails = response["data"];
        let concatName = (this.loggedInuserDetails.Firstname + ' ' + this.loggedInuserDetails.LastName).toLocaleLowerCase();
        this.callDetails.map(element => {
          element['To'] = (element['To'] && element['To'] !== '' && (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 11) && (element['EmployeeName'] && element['EmployeeName'].toLocaleLowerCase() !== concatName) ? element['To'].replace(/\d(?=\d{4})/g, "X") : element['To'])
        });
      }
    });
    this._EventSubscription.push(getCallDetailsSub);
  }
  showSmsDetails = () => {
    const getSmsDetailsSub = this.preSalesleadDetailsService.getSmsDetails(this.loggedInuserDetails, this.enquiryDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.smsDetails = response["data"];
      }
    });
    this._EventSubscription.push(getSmsDetailsSub);
  }
  getEmailDetails = (Input) => {
    const getEmailDetailsSub = this.preSalesleadDetailsService.getEmailDetails(this.loggedInuserDetails, this.enquiryDetails,Input).subscribe((response) => {
      if (response && response["data"]) {
         this.EmailData = response["data"][0];
      }
    });
    this._EventSubscription.push(getEmailDetailsSub);
  }

  OpenEmail=(EData)=>
  {
    this.sharedService.sharePresalesIneractionDetails(EData);
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  //** action for ng On Destroy  **/
  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}