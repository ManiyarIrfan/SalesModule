import { Component, OnInit, Input, SimpleChanges, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
// import { NavItem } from '../navigations/nav.item';
// import { ILoggedInuserDetails } from 'src/app/shared/modules/Login/login-model';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import { animateText, onSideNavChange } from 'src/styles/animation';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
interface Page {
  link: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'tru-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  animations: [onSideNavChange, animateText],
})

export class SidemenuComponent implements OnInit {
  public loggedInuserDetails: any[];
  @Input() data: any;
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  public sideNavState: boolean = false;
  public linkText: boolean = false;
  public topMenu: any;
  public navItems: any;
  public MenuList: any;
  public SubMenuList: any;
  public hideAll: any;
  public showrole: string;
  public HideShowSubMenu: any;
  public pages: Page[] = [
    { name: 'Inbox', link: 'some-link', icon: 'inbox' },
    { name: 'Starred', link: 'some-link', icon: 'star' },
    { name: 'Send email', link: 'some-link', icon: 'send' }]
  public HomeTabs = [
    { key: 'Dashboard' },
    { key: 'Property' },
    { key: 'Profile' },
    { key: 'Documents' },
    { key: 'Support Ticket' }]
  selectedMenu: any;

  constructor(public router: Router, private spinner: NgxSpinnerService, private shared: SharedService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('currentUser'));    
  }

  // Method for View Submenu Items
  submenu = (item): void => {
    this.selectedMenu = item["key"];
    this.shared.shareMenuItem(item["key"]);
    this.closesidebar();
  }

  // Select Menu Item
  onItemSelected = (item: any): void => {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
  }

  //Method for logging out
  onLoggedOut = (): void => {
    this.spinner.show();
    setTimeout(() => {
      localStorage.removeItem('isLoggedin');
      localStorage.removeItem('LoggedinUser');
      this.router.navigate(['/user/login']);
      localStorage.clear();
      this.spinner.hide();
    }, 1500);
  }

  //Used for NgFor to unique Id Everytime
  trackByFn(item) {
    return item.id;
  }
 
  //Close SideMenu with Close-sidebar class
  closesidebar() {
    $("#close-sidebar").click(function () {
      $(".page-wrapper").removeClass("toggled");
    });
    this.shared.closeMenu(false);
  }

  // Open SideMenu
  Opensidebar() {
    $("#show-sidebar").click(function () {
      $(".page-wrapper").addClass("toggled");
    });
  }

  // Close SideMenu
  close() {
    setTimeout(() => {
      $(".page-wrapper").removeClass("toggled");
    }, 200);
  } 
}
