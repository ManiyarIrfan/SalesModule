import { Component, OnInit, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { CustomerDetailService } from 'src/app/shared/services/employee/customer-detail.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IuserInuserDetails } from 'src/app/shared/models/employeeModel/edit-view-details.model';
import { Subscription } from 'rxjs';
import { Iemailmodel } from 'src/app/shared/models/employeeModel/search-details.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tru-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.scss']
})
export class SearchDetailsComponent implements OnInit, OnDestroy {
  public CC: string = "";
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public isShowDetails: boolean = false;
  public customers: Observable<any[]>;
  public searchTerms = new Subject<string>();
  public searchText = '';
  public flag: boolean = true;
  public userInuserDetails: IuserInuserDetails = <IuserInuserDetails>{};
  public to: string = "";
  public emailmodel: Iemailmodel = <Iemailmodel>{};
  public showEmail: boolean = false;
  public successfullMailSend: any = "";
  public from: string;
  public To: string;
  public disableAllFields: string;
  public countryCode: any = [
    { key: "+91", value: "India" },
    { key: "+81", value: "Japan" }];
  public CountryCode: string = "+91";

  public reportSubscription: Array<Subscription> = []
  @Output() eventEmited = new EventEmitter<boolean>();

  constructor(
    private sharedService: SharedService,
    private customerDetailService: CustomerDetailService,
    private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
  }
  searchCustomer(term: string): void {
    this.flag = true;
    const search = this.sharedService.search(this.loggedInuserDetails, term).subscribe((response) => {
      this.customers = response && response['data'];
    })
    this.reportSubscription.push(search);
  }
  onselectCustomer(ClientObj) {
    if (ClientObj.EntityId != 0) {
      this.searchText = `${ClientObj.FirstName} - ${ClientObj.LastName} - ${ClientObj.MobileNo} - ${ClientObj.UserId}`;
      this.userInuserDetails = ClientObj;
      this.sharedService.shareSelectedUser(ClientObj);
      this.to = this.userInuserDetails.UserId;
      this.CC = this.loggedInuserDetails.UserEmail;
      this.flag = false;
      this.eventEmited.emit(this.isShowDetails);
      this.showEmail = true;
    } else {
      return false;
    }
    this.onChangeCountryCode(this.CountryCode);
  }

  onSendEmail = (employeeDashboardForm) => {
    const sendEmail = this.customerDetailService.sendEmail(this.userInuserDetails, this.loggedInuserDetails, this.emailmodel).subscribe((response) => {
      if (response) {
        this.successfullMailSend = response;
        this.clearscreen(employeeDashboardForm);
        this.emailmodel = <Iemailmodel>{};
      }
    });
    this.reportSubscription.push(sendEmail);
  }

  clearscreen = (employeeDashboardForm) => {
    employeeDashboardForm.form.markAsPristine();
    employeeDashboardForm.form.markAsUntouched();
  }

  clearmessage = () => {
    this.successfullMailSend = [];
  }

  onDialCall = () => {
    if (this.from && this.To && this.from !== "") {
      //-------For Dial Call(Calling Functionality)-------//
      const onCall = this.customerDetailService.onCall(this.loggedInuserDetails, this.To, this.from).subscribe((response) => {
        if (response) {
        }
      });
      this.reportSubscription.push(onCall);
    }
    else {
      this.showFailedBar("Sorry Mobile No is not Available");
    }
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  onChangeCountryCode = (value) => {
    //-------For Display Numbers and Adding Country Code-------//
    this.from = "+91" + this.loggedInuserDetails.MobileNo;
    this.To = value + this.userInuserDetails.MobileNo;
  }
  ngOnDestroy() {
    for (let item of this.reportSubscription) {
      item.unsubscribe();
    }
  }
  //********** show snackbar for message **********//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['red-snackbar'] });
  }

  // Clear the General Search List on "On Click"
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    this.customers = null;
  }
}