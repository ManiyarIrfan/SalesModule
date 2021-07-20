import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { SignUpService } from '../../services/signup/sign-up.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    public usertype: any;
    public isShowLoggedinBtn: boolean;
    public isShow: boolean = false;
    public loggedInuserDetails: any;
    public menuItems: any;
    public isPlusActive: boolean = true;
    public isActive: boolean = false;
    public showMenu: string = '';
    public showMessage: string = "";
    public showHeader: string;
    public pushRightClass: string = 'push-right';   
    collapsed: boolean; 
    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(public router: Router,
        private sharedService: SharedService, private signUpService: SignUpService) {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit(): void {
        this.collapsed = false;

        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.sharedService.GetSideBarMenus().subscribe((response) => {
                    this.menuItems = response;
                    let type = [];
                    this.isShowLoggedinBtn = true;
                    switch (this.loggedInuserDetails.UserType.toUpperCase()) {
                        case 'CUSTOMER':
                        case 'REFERRAL':
                            this.usertype = "CUSTOMER";
                            type = this.menuItems.menu.filter(x => x.name === this.usertype);
                            this.addExpandClass(type[0]);
                            break;
                        case 'CHANNELPARTNER':
                            this.usertype = "CHANNEL PARTNER";
                            type = this.menuItems.menu.filter(x => x.name === this.usertype);
                            this.addExpandClass(type[0]);
                            break;
                        case 'CRO':
                            this.usertype = "CRO";
                            type = this.menuItems.menu.filter(x => x.name === this.usertype);
                            this.addExpandClass(type[0]);
                            break;
                        default:
                            this.usertype = this.loggedInuserDetails.UserType.toUpperCase();
                            type = this.menuItems.menu.filter(x => x.name === this.usertype);
                            this.addExpandClass(type[0]);
                            break;
                    }
                });
            }
        }
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.sharedService.logoutListener.subscribe(() => {
            this.isShowLoggedinBtn = false;
        });
    }
    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }
    isLoggedIncheck = (menuName) => {
        switch (menuName.name) {
            case "Customer":
                {
                    if (!localStorage.getItem('LoggedinUser')) {
                        this.router.navigate(['/login']);
                    }
                    //FOR POPUP
                    // else {
                    //     let user = JSON.parse(localStorage.getItem('LoggedinUser'));
                    //     if (user && user.UserType) {
                    //         if (user.UserType !== "Customer" && user.UserType !== "Referral") {
                    //             this.isPlusActive = true;
                    //             this.isSubMenuActive = true;
                    //             this.customerAuthModal.show();
                    //             this.showHeader = "To access Customer Functionality.";
                    //             this.showMessage = "Kindly login/Register as Customer.";
                    //         } else {
                    //             this.isSubMenuActive = false;
                    //         }
                    //     }
                }
                break;
            case "Channel Partner":
                {
                    if (!localStorage.getItem('LoggedinUser')) {
                        this.router.navigate(['/login']);
                    }
                    // FOR POPUP
                    // else {
                    //     let user = JSON.parse(localStorage.getItem('LoggedinUser'));
                    //     if (user && user.UserType) {
                    //         if (user.UserType !== "ChannelPartner") {
                    //             this.isPlusActive = true;
                    //             this.isSubMenuActive = true;
                    //             this.customerAuthModal.show();
                    //             this.showHeader = "To access Channel Partner Functionality.";
                    //             this.showMessage = "Kindly login/Register as Channel Partner.";
                    //         } else {
                    //             this.isSubMenuActive = false;
                    //         }
                    //     }
                    // }
                }
                break;
            default:
                break;
        }
        if (this.isPlusActive)
            this.isPlusActive = false;
        else
            this.isPlusActive = true;
    }
    eventCalled = () => {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar = () => {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onLoggedout = () => {
        this.storeLogoutDetails();
        localStorage.removeItem('isLoggedin');
        localStorage.removeItem('LoggedinUser');
        this.isShowLoggedinBtn = false;
        this.sharedService.shareLogoutActivity();
        this.router.navigate(['/login']);
        localStorage.clear();
    }
    // **** Store the Logout users Details **** //
    storeLogoutDetails = () => {
        let Input = 'LOGOUT';
        this.signUpService.logoutDetails(this.loggedInuserDetails, Input).subscribe((response) => {
            if (response) { }
        })
    }

    // FOR POPUP
    // goRegister = () => {
    //     localStorage.removeItem('isLoggedin');
    //     localStorage.removeItem('LoggedinUser');
    //     //this.customerAuthModal.hide();
    //     this.router.navigate(['/signup']);
    //     //this.customerAuthModal.hide();
    // }
    // redirectToLogin = () => {
    //     localStorage.removeItem('isLoggedin');
    //     localStorage.removeItem('LoggedinUser');
    //     //this.customerAuthModal.hide();
    //     this.router.navigate(['/login']);
    //     //this.customerAuthModal.hide();
    // }
}
