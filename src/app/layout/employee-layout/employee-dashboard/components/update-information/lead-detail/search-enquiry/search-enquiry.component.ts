import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PreSalesleadDetailsService } from 'src/app/shared/services/employee/pre-saleslead-details.service';

@Component({
  selector: 'tru-search-enquiry',
  templateUrl: './search-enquiry.component.html',
  styleUrls: ['./search-enquiry.component.scss']
})
export class SearchEnquiryComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public loggedInuserDetails: any;
  public Enquiries: any = [];
  public searchText = '';
  public userInuserDetails: any;
  public flag: boolean = false;
  public noDataFound: boolean = false;
  public spinner: boolean = false;
  constructor(public preSalesleadDetailsService: PreSalesleadDetailsService,
    public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    } else {
      this.router.navigate(['/login']);
    }
  }
  searchEnquiry(term: string): void {
    // ******* Search the Enquiries from given Input *******//
    this.Enquiries = [];
    if (term) {
      this.spinner = true;
      this.flag = true;
      this.preSalesleadDetailsService.search(this.loggedInuserDetails, term).subscribe((response) => {
        if (response && response.length > 0) {
          this.Enquiries = response;
          this.Enquiries.map(element => {
            element.MobileNo = (element.MobileNo && element.MobileNo !== '' && (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 11) && (element.PresalesAgentAssigned !== this.loggedInuserDetails.EntityId) ? element.MobileNo.replace(/\d(?=\d{4})/g, "X") : element.MobileNo)
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
    // ******* Selected Enquiry details show in all fields *******//
    if (ClientObj.ClientId != 0) {
      this.searchText = `${ClientObj.FirstName} - ${ClientObj.LastName} - ${ClientObj.MobileNo} - ${ClientObj.TEnquiryId}`;
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
    this.Enquiries = [];
  }
}