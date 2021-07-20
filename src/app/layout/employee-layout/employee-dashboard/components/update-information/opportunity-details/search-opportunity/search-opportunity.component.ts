import { Component, OnInit, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SalesLeadDetailsService } from 'src/app/shared/services/employee/sales-lead-details.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'tru-search-opportunity',
  templateUrl: './search-opportunity.component.html',
  styleUrls: ['./search-opportunity.component.scss']
})
export class SearchOpportunityComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public opportunities = [];
  public searchText = '';
  public userInuserDetails: string;
  public flag: boolean = false;
  public noDataFound: boolean = false;
  public spinner: boolean = false;
  constructor(private salesLeadDetailsService: SalesLeadDetailsService, private router: Router) { }
  ngOnInit() {
    //  if (localStorage.getItem('LoggedinUser')) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    // } else {
    //    this.router.navigate(['/login']);
    //  }
  }
  searchOpportunity = (term) => {
    this.flag = true;
    if (term) {
      this.opportunities = [];
      this.spinner = true;
      this.salesLeadDetailsService.search(this.loggedInuserDetails, term).subscribe((response) => {
        if (response['data'][1].length > 0) {
          this.opportunities = response['data'][1];
          this.opportunities.map(element => {
            element.MobileNo = (element.MobileNo && element.MobileNo !== '' && (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 11) && (element.PresalesAgentAssigned !== this.loggedInuserDetails['EntityId']) ? element.MobileNo.replace(/\d(?=\d{4})/g, "X") : element.MobileNo)
            element.MobileNoforWA = element.MobileNo;
          });
          this.noDataFound = false;
        } else {
          this.noDataFound = true;
        }
        this.spinner = false;
      });
    }
  }
  onselectEnquiry(ClientObj) {
    if (ClientObj.ClientId != 0) {
      this.searchText = `${ClientObj.Name} - ${ClientObj.MobileNo} - ${ClientObj.TReferralId}`;
      this.userInuserDetails = ClientObj;
      this.messageEvent.emit(this.userInuserDetails);
      this.flag = false;
    } else {
      return false;
    }
  }

  // Clear the General Search List on "On Click"
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    this.opportunities = [];
  }
}
