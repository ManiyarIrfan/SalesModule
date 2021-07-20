import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';

@Component({
  selector: 'app-finance-layout',
  templateUrl: './finance-layout.component.html',
  styleUrls: ['./finance-layout.component.scss']
})
export class FinanceLayoutComponent implements OnInit {
  loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  sidebarFlag: boolean;
  TabName: string;
  HomeTabs = [
    { key: 'Dashboard' },
    { key: 'Property' },
    { key: 'Profile' },
    { key: 'Documents' },
    { key: 'Support Ticket' }
  ]
  userProfile: string;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
    private signUpService: SignUpService) {
    this.userProfile = 'https://industrydev.blob.core.windows.net/industrydev/Documents/Master/man.png';

    this.TabName = 'Dashboard';
    let Action = this.actRoute.snapshot.queryParams["Action"];   

    if (Action) {
      this.selectedMenu(Action);
    }
    this.sharedService.closeSideMenuListner.subscribe((item) => {
      if (!item) this.sidebarFlag = item;
    });
    this.sharedService.sharedSelectedMenuListner.subscribe((item) => {
      if (item !== '') {
        this.selectedMenu(item);
      }
    });
  }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails === null) {
      this.router.navigate(['/login'], { queryParams: { flag: true, Module: 'finance', Action: 'Dashboard' } });
    }
  }
  ShowSideBar = () => {
    this.sidebarFlag = !this.sidebarFlag;
  }

  selectedMenu = (item) => {
    this.TabName = '';
    this.TabName = item;
    let baseURL = 'finance?Action=';
    this.location.replaceState(baseURL + item);
  }

  // login for Finance
  login = () => {
    if (JSON.parse(localStorage.getItem('LoggedinUser')) === null) {
      this.router.navigate(['/login'], { queryParams: { flag: true, Module: 'finance', Action: 'Dashboard' } });
    }
  }

  // register new user
  register = () => {
    if (JSON.parse(localStorage.getItem('LoggedinUser')) === null) {
      this.router.navigate(['/signup'], { queryParams: { flag: true, Action: 'Dashboard', Module: 'finance' } });
    }
  }

  // log out from Module
  logout = () => {
    this.signUpService.logoutDetails(JSON.parse(localStorage.getItem('LoggedinUser')), 'LOGOUT')
      .subscribe((response) => {
        if (response) { }
      });
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('LoggedinUser');
    this.router.navigate(['/login']);
    localStorage.clear();
    sessionStorage.clear();
    this.loggedInuserDetails = null;
    this.TabName = 'Dashboard';
    // this.logoutFlag = true;
    if (document.getElementById("kommunicate-widget-iframe")) {
      (window as any).Kommunicate && (window as any).Kommunicate.logout();
    }
    // this._authService.signOut(true);
  }
}
