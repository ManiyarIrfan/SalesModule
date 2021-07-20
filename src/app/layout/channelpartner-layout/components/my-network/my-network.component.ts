import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MyNetworkService } from 'src/app/shared/services/channelPartner/my-network.service';
import {IloggedInuserDetails} from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import {IchannelPartnerModel,IlistreferredChannelPartner} from 'src/app/shared/models/channelpartner/my-network.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tru-my-network',
  templateUrl: './my-network.component.html',
  styleUrls: ['./my-network.component.scss']
})
export class MyNetworkComponent implements OnInit {
  public isMobileAvailable: boolean;
  public showmobile: string = '';
  public isshow: boolean;
  public loggedInuserDetails:IloggedInuserDetails[]=[];
  public channelPartnerModel:IchannelPartnerModel=<IchannelPartnerModel>{};
  public isCollapsed = true;
  public disableReferCpBtn: boolean = false;
  public listreferredChannelPartner:IlistreferredChannelPartner[]  = [];
  public isSpinnerActive: boolean = true;
  public p1: number;
  public notFound: boolean = true;
  public isLoading: boolean = true;
  public isEmailAvailable: boolean;
  public showemail: string = '';



  public myChannelPartnerReferralSubscription:Subscription;
  public mobileDuplicationSubscription:Subscription;
  public emailDuplicationSubscription:Subscription;
  public referChannelpartnerSubscription:Subscription;

  constructor(private router: Router, private myNetworkService: MyNetworkService,private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.myChannelPartnerReferral();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  myChannelPartnerReferral = () => {
    //*********** Channel partners list referred by Channel Partners ***********//

    this.myChannelPartnerReferralSubscription=this.myNetworkService.myChannelPartnerReferral(this.loggedInuserDetails).subscribe((response) => {
      this.listreferredChannelPartner = (response && response["data"] && response["data"].length > 0) ? response["data"] : [];
      this.notFound = this.listreferredChannelPartner.length > 0 ? true : false;
      this.isSpinnerActive = false;
    });
    //*********** End ***********//
  }
  getMobileValidation = (mobile) => {
    //*********** Mobile Number Validation Check***********//
    var mobilepattern: any = /^\d{10}$/;
    if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
      this.mobileDuplicationSubscription=this.myNetworkService.mobileDuplication(this.loggedInuserDetails, mobile).subscribe((response) => {
        if (response && response["data"][0]) {
          this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
          this.showmobile = response["data"][0].IsAvailable;
        }
      });
    } else {
      this.showmobile = "";
    }
    //*********** End ***********//
  }
  getEmailValidation = (email) => {
    var emailpattern: any = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$/;
    if (email && emailpattern.test(String(email).toLowerCase())) {
      this.emailDuplicationSubscription=this.myNetworkService.emailDuplication(this.loggedInuserDetails, email).subscribe((response) => {
        if (response && response["data"] && response["data"][0]) {
          this.isEmailAvailable = (response["data"][0].IsAvailable === 'Available');
          this.showemail = response["data"][0].IsAvailable;
        }
      });
    } else {
      this.showemail = "";
    }
  }
  referChannelpartner = (channelPartnerModel, myNetworkForm) => {
    //*********** Refer Channelpartner ***********//
    this.isLoading = false;
    this.referChannelpartnerSubscription=this.myNetworkService.referChannelpartner(this.loggedInuserDetails, channelPartnerModel).subscribe((response) => {
      if (response && response["successful"]) {
        this.showSuccessBar("Channel Partner Successfully Referred.");
        this.channelPartnerModel =<IchannelPartnerModel>{};
        this.myChannelPartnerReferral();
      } else {
        this.showFailedBar("Channel Partner failed to Referred.");
      } 
      this.isLoading = true;
    });
    this.showmobile = "";
    myNetworkForm.form.markAsPristine();
    myNetworkForm.form.markAsUntouched();
    //*********** End ***********//
  }
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
  }
  trackByFn(item) {
    return item.id; // or item.id
  }
  ngOnDestroy()
  {  
    this.myChannelPartnerReferralSubscription ? this.myChannelPartnerReferralSubscription.unsubscribe():null;
    this.mobileDuplicationSubscription ? this.mobileDuplicationSubscription.unsubscribe():null;
    this.emailDuplicationSubscription ? this.emailDuplicationSubscription.unsubscribe():null;
    this.referChannelpartnerSubscription ? this.referChannelpartnerSubscription.unsubscribe():null;
  }

}
