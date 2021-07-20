import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';
import { SocialAuthService } from 'src/app/shared/services/social/socialauth.service';

@Component({
  selector: 'app-community-layout',
  templateUrl: './community-layout.component.html',
  styleUrls: ['./community-layout.component.scss']
})
export class CommunityLayoutComponent implements OnInit {
  public allDiscussions: any[] = [];
  public loggedInuserDetails: any = [];
  public breadcrumbTitle: string = '';
  public TabName: string = '';
  public userProfile: string = '';
  public notifiactionCount: number;
  public logoutFlag: boolean;
  public flag: boolean;
  public index: number;
  public ProfileTab: any;
  public Notifications: any[] = []
  public HomeTabs = [
    { key: 'Home' },
    { key: 'Projects' },
    { key: 'Partners' },
    { key: 'Customers' },
    { key: 'Events' }]

  public socialTabs = [
    { title: 'Instagram', css: 'insta-bg', icon: 'fa fa-instagram', url: 'https://www.instagram.com/trurealty.in/' },
    { title: 'Facebook', css: 'facebook-bg', icon: 'fa fa-facebook-official', url: 'https://www.facebook.com/trurealty.in/' },
    { title: 'Twitter', css: 'twitter-bg', icon: 'fa fa-twitter', url: 'https://twitter.com/trurealty_in' },
    { title: 'Linkedin', css: 'linked-bg', icon: 'fa fa-linkedin', url: 'https://www.linkedin.com/company/trurealty/' }
  ]

  constructor(
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _sharedService: SharedService,
    private _authService: SocialAuthService,
    private _signUpService: SignUpService) { }

  ngOnInit() {
    this._spinner.show();
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails !== null) {
      this.userProfile = (this.loggedInuserDetails.ProfilePic !== null) ? this.loggedInuserDetails.ProfilePic : 'https://industrydev.blob.core.windows.net/industrydev/Documents/Master/man.png';
    } else {
      this.userProfile = 'https://industrydev.blob.core.windows.net/industrydev/Documents/Master/man.png';
    }
    this.TabName = 'Home';
    setTimeout(() => { this._spinner.hide(); }, 1000);
    // if (this.loggedInuserDetails !== null) {
    //   this.allNotifications();
    // }
  }

  // Select Pages and go
  Page = (item) => {
    this.TabName = '';
    this.TabName = item;
    this.flag = false;
    if (item === 'Home') {
      this._sharedService.goToHome(true);
    }
  }

  // goto Profile Tab
  gotoProfileTabs = (item) => {
    this.ProfileTab = item;
  }

  // Hide Navbar Menu
  hideMenu = (item, index) => {
    this.index = index
    if (item !== '' && this.index > 0) {
      this.flag = false;
      this.index = 0;
    }
  }

  // hide show navbar for mobile UI
  showMenu = () => {
    this.flag = !this.flag;
  }

  // allNotifications = () => {
  //   this._discussionService.getNoficications(this.loggedInuserDetails)
  //     .subscribe((response) => {
  //       this.Notifications = Array.from(response['data'].reduce((m, t) => m.set(t.UserId, t), new Map()).values());
  //       this.notifiactionCount = this.Notifications.reduce((sum, item) => sum + item.IsRead, 0);
  //     });
  // }

  // Clear the General Search List on "On Click"
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    this.hideMenu(this.TabName, this.index);
  }

  // login for community
  login = () => {
    if (JSON.parse(localStorage.getItem('LoggedinUser')) === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'Home' } });
    }
  }

  // register new community user
  register = () => {
    if (JSON.parse(localStorage.getItem('LoggedinUser')) === null) {
      this._router.navigate(['/signup'], { queryParams: { flag: true, Action: 'Home' } });
    }
  }

  // go to module as per usertype
  landingPage = () => {
    switch (this.loggedInuserDetails['UserType'].toLocaleLowerCase()) {
      case "customer":
        this._router.navigate(['/customer/customerfeedback']);
        break;
      case "referral":
        this._router.navigate(['/customer/customerfeedback']);
        break;
      case "employee":
        this._router.navigate(['/employee/home']);
        break;
      case "channelpartner":
        this._router.navigate(['/customer/customerfeedback']);
        break;
      case "cro":
        this._router.navigate(['/customer/customerfeedback']);
        break;
    }
  }

  // log out from Module
  logout = () => {
    this._signUpService.logoutDetails(JSON.parse(localStorage.getItem('LoggedinUser')), 'LOGOUT').subscribe((response) => {
      if (response) { }
    });
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('LoggedinUser');
    this._router.navigate(['/community']);
    localStorage.clear();
    sessionStorage.clear();
    this.loggedInuserDetails = null;
    this.TabName = 'Home';
    this.logoutFlag = true;
    if (document.getElementById("kommunicate-widget-iframe")) {
      (window as any).Kommunicate && (window as any).Kommunicate.logout();
    }
    // this._authService.signOut(true);
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }
}
