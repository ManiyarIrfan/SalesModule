
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { environment } from 'src/environments/environment';
import { ScheduledSiteVisitService } from 'src/app/shared/services/employee/scheduled-site-visit.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild('changePasswordModell', { static: false }) public changePasswordModell: ModalDirective;
    @ViewChild('confirmChangeRoleModel', { static: false }) public confirmChangeRoleModel: ModalDirective;
    @ViewChild('FAQModal', { static: false }) public FAQModal: ModalDirective;
    @ViewChild('profilePicModal', { static: false }) public profilePicModal: ModalDirective;
    public uploadImage: FileAttachment[] = [];
    public previewImage: string;
    public dsbButton: boolean = false;
    public updateProfilePicSub: Subscription;
    public employeePic: any;
    public correct: string = "";
    public conf: string;
    public new: string;
    public PasswordUpdationFailed: string = "";
    public showProject: any;
    public showrole: string = "";
    public isShowLoggedinBtn: boolean = false;
    public loggedInuserDetails: any = [];
    public pushRightClass: string = 'push-right';
    public changePasswordModel: any = {};
    public showEmail: boolean = false;
    public Level: any;
    public hrUrl: string;
    public changeRole: number;
    public getAllPresalesLead: any = [];
    public showReferral: any = [];
    public searchText: string = '';
    public totalList: any = [];
    public flag: boolean = false;
    public id: any;
    public tabActivate: string;
    public switchRoleModal: any = {};
    public showSuccessMessage: string = '';
    public showUnSuccessMessage: string = '';
    public dsbYesBtn: boolean = false;
    public menuItems: any;
    public displayselectedPDF: string = '';
    public topMenuList: string[];
    public dynamicURL = '';
    public VersionInfo = '';
    public FileSize: Number;
    public FAQDataUrl: any = [];
    public FAQURL: any = [];
    public notFound: string = '';
    //public allEmployeeRole: any = [];
    //public GetAllEmployeesRolesSubscription: Subscription;
    public getpasswordupdateSubscription: Subscription;
    public switchRoleSubscription: Subscription;
    public showCustomer: any = [];
    public hideFlag: boolean;
    constructor(private signUpService: SignUpService,
        private loginService: LoginService, public router: Router,
        private sharedService: SharedService,
        private scheduledSiteVisitService: ScheduledSiteVisitService,
        private sanitizer: DomSanitizer,
        private snackBar: MatSnackBar
    ) {
        this.router.events.subscribe(val => {
            if ((val instanceof NavigationEnd) && (window.innerWidth <= 992) && (this.isToggled())) {
                this.toggleSidebar();
            }
        });
        this.hideDiv();
    }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            this.employeePic = (this.loggedInuserDetails['ProfilePic'] && this.loggedInuserDetails['ProfilePic'] !== '') ? this.loggedInuserDetails['ProfilePic'] : 'assets/images/user.png';
            this.dynamicURL = this.router.url.split('/')[1];
            this.loggedInuserDetails.UserType !== 'ChannelPartner' ? this.FAQPdf() : null;
            if (this.loggedInuserDetails) {
                //---------- checking login user role  ------------//
                switch (this.loggedInuserDetails.UserType) {
                    case "Employee": {
                        this.showEmail = true;
                        switch (this.loggedInuserDetails.Role) {
                            case 1: {
                                this.showrole = "Admin";
                                break;
                            }
                            case 2: {
                                this.showrole = "CRM";
                                break;
                            }
                            case 3: {
                                this.showrole = "Sales";
                                break;
                            }
                            case 4: {
                                this.showrole = "BackOffice";
                                break;
                            }
                            case 5: {
                                this.showrole = "Pre-Sales";
                                break;
                            }
                            case 6: {
                                this.showrole = "Power-Sales";
                                break;
                            }
                            case 7: {
                                this.showrole = "FDA";
                                break;
                            }
                            case 9: {
                                this.showrole = "Senior Management";
                                break;
                            }
                            case 11: {
                                this.showrole = "Presales Admin";
                                break;
                            }
                        }
                        break;
                    }
                    case "ChannelPartner": {
                        this.showrole = "ChannelPartner";
                        break;
                    }
                    case "Customer": {
                        this.showrole = "Customer";
                        break;
                    }
                    case "CRO": {
                        this.showrole = "CRO";
                        break;
                    }
                }
                //-------End-------//
                this.CheckVersion();
                this.Level = this.loggedInuserDetails.Level;
                this.isShowLoggedinBtn = true;
            }
        }
        // else {
        //     this.loggedInuserDetails.UserType = 'Guest';
        // }

        this.sharedService.logoutListener.subscribe(() => {
            this.isShowLoggedinBtn = false;
        });
        this.hrUrl = environment.hrLoginUrl;
        //  cancel General Search list 
        this.sharedService.changecancelGenralSearchListener.subscribe(() => {
            this.totalList = [];
        });
        this.getTopMenus();
    }
    showPDF = (input) => {
        this.displayselectedPDF = input ? input : '';
        this.displayselectedPDF === 'kekaravfaq' ? this.getFAQ('Kekarav CP FAQ') : this.getFAQ('CP Referral FAQ');
    }
    getFAQ(Input) {
        this.sharedService.getFileDetailServices(this.loggedInuserDetails, Input).subscribe((response) => {
            if (response["successful"] && response["data"] && response["data"][0].length > 0) {
                this.FAQDataUrl = response["data"][0][0] && response["data"][0][0].FileURL ? this.sanitizer.bypassSecurityTrustResourceUrl(response["data"][0][0].FileURL + '#toolbar=0&navpanes=0&scrollbar=0') : null;
            } else {
                this.notFound = 'No Data Found';
            }
        });
    }

    hideDiv = () => {
        const currentRes = window.matchMedia("(min-width: 550px)");
        if (currentRes.matches) {
            this.hideFlag = true; // window width is at least 500px
        } else {
            this.hideFlag = false; // window width is less than 500px
        }
    }

    FAQPdf() {
        let Input;
        if (this.loggedInuserDetails.UserType === 'CRO') {
            Input = 'Kekarav CRO FAQ';
        }
        else if (this.loggedInuserDetails.UserType === 'Employee' && this.loggedInuserDetails.EngagementType !== 'OnDemand') {
            Input = 'Kekarav Employee FAQ';
        }
        else if (this.loggedInuserDetails.UserType === 'Customer') {
            Input = 'Kekarav Customer FAQ';
        }
        else if (this.loggedInuserDetails.UserType === 'Employee' && this.loggedInuserDetails.EngagementType === 'OnDemand') {
            Input = 'Kekarav CRO FAQ';
        }
        this.sharedService.getFileDetailServices(this.loggedInuserDetails, Input).subscribe((response) => {
            if (response["successful"] && response["data"] && response["data"][0].length > 0) {
                this.FAQURL = response["data"][0][0] && response["data"][0][0].FileURL ? this.sanitizer.bypassSecurityTrustResourceUrl(response["data"][0][0].FileURL + '#toolbar=0&navpanes=0&scrollbar=0') : null;
            } else {
                this.notFound = 'No Data Found';
            }
        });
    }
    CheckVersion() {
        this.VersionInfo = environment.version;
        // this.loginService.getVersion().subscribe((response) => {
        //     if (response) {
        //         let finalVersion = response;
        //         let versionList = JSON.parse(sessionStorage.getItem('AppVersion'));
        //         if (versionList) {
        //             if (finalVersion["menu"][0]["version"] === versionList["menu"][0]["version"]) {
        //                 this.VersionInfo = versionList["menu"][0]["version"];
        //             }
        //         } else {
        //             if (finalVersion["menu"][0]["version"] === environment.version) {
        //                 console.log('Application version : ' + finalVersion["menu"][0]["version"]);
        //                 this.VersionInfo = finalVersion["menu"][0]["version"];
        //                 sessionStorage.setItem('AppVersion', JSON.stringify(finalVersion));
        //             }
        //         }
        //     }
        // });
    }
    getTopMenus = () => {
        this.sharedService.GetSideBarMenus().subscribe((response) => {
            this.menuItems = response;
            this.isShowLoggedinBtn = true;
            let usertype;
            // if (this.loggedInuserDetails) {
            switch (this.loggedInuserDetails.UserType.toUpperCase()) {
                case 'CUSTOMER':
                case 'REFERRAL':
                    usertype = "CUSTOMER";
                    this.topMenuList = this.menuItems.menu.filter(x => x.name === usertype)[0]['sub'];
                    break;
                case 'CHANNELPARTNER':
                    usertype = "CHANNEL PARTNER";
                    this.topMenuList = this.menuItems.menu.filter(x => x.name === usertype)[0]['sub'];
                    break;
                case 'CRO':
                    usertype = "CRO";
                    this.topMenuList = this.menuItems.menu.filter(x => x.name === usertype)[0]['sub'];
                    break;
                // case 'GUEST':
                //     usertype = 'COMMUNITY';
                //     // this.topMenuList = this.menuItems.menu.filter(x => x.name === usertype)[0]['sub'];
                //     this.topMenuList = [];
                //     break;
            }
            // }
        });
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }
    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    updatePassword = (changePasswordForm) => {
        this.getpasswordupdateSubscription = this.loginService.getpasswordupdate(this.changePasswordModel, this.loggedInuserDetails).subscribe((response) => {
            if (response && response["data"][0].Result === 'Success') {
                this.snackBar.open('Password Updated Successfully.Please login again', null, { duration: 5000, panelClass: ['blue-snackbar'] });
                this.correct = "";
                setTimeout(() => {
                    this.onLoggedout();
                }, 5000);

            } else {
                this.snackBar.open('Password Update Failed. Please Enter Correct Old Password', null, { duration: 5000, panelClass: ['red-snackbar'] });
            }
            this.changePasswordModel = {};
            changePasswordForm.form.markAsPristine();
            changePasswordForm.form.markAsUntouched();
            this.changePasswordModell.hide();
        });
    }
    //---to check newpassword and confirm password are same or not---//
    check = (changePasswordModel) => {
        if (changePasswordModel.confirmPwd) {
            this.new = changePasswordModel.NewPwd;
            this.conf = changePasswordModel.confirmPwd;
            this.correct = this.new === this.conf ? "Match" : "New and Confirm password must be same";
        }
    }
    // ----- For Change the Role -----//
    switchRole = (role) => {
        this.dsbYesBtn = false;
        this.switchRoleModal['Role'] = role;
        this.switchRoleModal['Reason'] = null;
        this.confirmChangeRoleModel.show()
    }
    // Switch Role Functionality
    confirmSwitchRole = (switchRoleForm) => {
        this.dsbYesBtn = true;
        this.switchRoleSubscription = this.sharedService.switchRole(this.loggedInuserDetails, this.switchRoleModal).subscribe((response) => {
            if (response && response['data'] && response['data'][0] && response['data'][0]['Msg']) {
                (response['data'][0]['Msg'].search('pending') !== -1) ? this.showUnSuccessMessage = response['data'][0]['Msg'] : this.showSuccessMessage = response['data'][0]['Msg'];
            } else {
                this.showUnSuccessMessage = 'Request not submited successfully.Please Contact in Office.';
            }
            switchRoleForm.form.reset();
            this.switchRoleModal['Role'] = '';
            setTimeout(() => {
                this.confirmChangeRoleModel.hide();
                this.showSuccessMessage = '';
                this.showUnSuccessMessage = '';
            }, 5000);
        })
    }
    onLoggedout() {
        this.signUpService.logoutDetails(JSON.parse(localStorage.getItem('LoggedinUser')), 'LOGOUT').subscribe((response) => {
            if (response) { }
        });
        this.storeLogoutDetails();
        localStorage.removeItem('isLoggedin');
        localStorage.removeItem('LoggedinUser');
        this.isShowLoggedinBtn = false;
        this.sharedService.shareLogoutActivity();
        this.router.navigate(['/login']);
        localStorage.clear();
        sessionStorage.clear();
        if (document.getElementById("kommunicate-widget-iframe")) {
            (window as any).Kommunicate && (window as any).Kommunicate.logout();
        }
    }

    changepassword(changePasswordForm) {
        this.changePasswordModel = {};
        this.correct = '';
        changePasswordForm.form.markAsPristine();
        changePasswordForm.form.markAsUntouched();
        this.changePasswordModell.show();
    }
    onClose = () => {
        this.changePasswordModell.hide();
        this.confirmChangeRoleModel.hide();
        this.FAQModal.hide();
    }
    // **** Store the Logout users Details **** //
    storeLogoutDetails = () => {
        let Input = 'LOGOUT';
        this.signUpService.logoutDetails(this.loggedInuserDetails, Input).subscribe((response) => {
            if (response) { }
        })
    }
    //*****  on Enter Click *****//
    enterClick = (event, searchText) => {
        if (event.keyCode == 13) {
            this.searchEnquiry(searchText);
        }
    }
    //*****  on escape Click *****//
    escapeClick = (event) => {
        if (event.keyCode == 27) {
            this.totalList = [];
        }
    }
    // //*****  Search Enquiry and Leads *****//
    searchEnquiry = (term) => {
        this.totalList = [];
        this.showReferral = [];
        this.getAllPresalesLead = [];
        if (term && term !== '') {
            this.scheduledSiteVisitService.search(this.loggedInuserDetails, term).subscribe((response) => {
                if (response && response['data'][0] || response['data'][1] || response['data'][2]) {
                    if (response && response['data'][0].length > 0) {
                        this.getAllPresalesLead = response['data'][0];
                    }
                    if (response && response['data'][1].length > 0) {
                        this.showReferral = response['data'][1];
                    }
                    if (response && response['data'][2].length > 0) {
                        this.showCustomer = response['data'][2];
                    }
                    this.flag = true;
                    let testArray = [];
                    testArray = this.getAllPresalesLead.concat(this.showReferral);
                    this.totalList = testArray.concat(this.showCustomer);
                    this.totalList = this.totalList.sort(() => Math.random() - 0.5).slice(0, 15);
                    let concatName = (this.loggedInuserDetails.Firstname + ' ' + this.loggedInuserDetails.LastName).toLocaleLowerCase();
                    this.totalList.map(element => {
                        element.MobileNoforWA = element.MobileNo;
                        element.MobileNo = (element.MobileNo && element.MobileNo !== '' && (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 11) && (element.PresalesAgentAssigned1 && element.PresalesAgentAssigned1.toLocaleLowerCase() !== concatName) ? element.MobileNo.replace(/\d(?=\d{4})/g, "X") : element.MobileNo)
                    });
                }
            });
        }
    }
    onselectLead = (selected) => {
        if (selected.UserType === 'Referral' || selected.UserType === 'Customer') {
            //************* Moved to Lead details Tab **************//
            this.id = selected.ReferralId;
            this.sharedService.allLeadSearchDetails({ tabNo: 'tab15', LeadId: this.id, IsReferralActive: selected.IsReferralActive });
        } else {
            this.id = selected.EnquiryId;
            this.sharedService.allLeadSearchDetails({ tabNo: 'tab14', id: this.id });
        }
        this.flag = false;
        this.searchText = '';
    }
    openFAQPopup = () => {
        this.FAQModal.show();
    }
    gotoIdea = () => {
        this.router.navigate([this.dynamicURL + '/idea-module']);
    }
    //***** show profile picture update popup*****//
    showProfilePic = () => {
        this.uploadImage = [];
        this.previewImage = (this.loggedInuserDetails['ProfilePic'] && this.loggedInuserDetails['ProfilePic'] !== '') ? this.loggedInuserDetails['ProfilePic'] : 'assets/images/user.png';
        this.dsbButton = true;
        this.profilePicModal.show();
    }
    //***** update api call*****//
    updateProfilePic = () => {
        this.dsbButton = true;
        this.updateProfilePicSub = this.loginService.profilePicUpdate(this.loggedInuserDetails, this.uploadImage).subscribe((response) => {
            if (response && response['successful']) {
                this.snackBar.open('Profile Picture Updated Successfully.For the Changes to Take Effect, You Must Logout and Log Back in.', null, { duration: 5000, panelClass: ['blue-snackbar'] });
            } else {
                this.snackBar.open('Could Not Update your Profile Picture.Please Try After Some Time.', null, { duration: 5000, panelClass: ['red-snackbar'] });
            }
            this.closePopup();
        })
    }
    //***** check size and show preview of image*****//
    complete = (event) => {
        if (event && event.length > 0) {
            this.dsbButton = true;
            this.FileSize = Number(this.uploadImage[0]['size']);
            if (this.uploadImage.length === 1) {
                if (Number(this.uploadImage[0]['size']) < 204800) {
                    this.previewImage = null;
                    this.previewImage = ('data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(this.uploadImage[0].content) as any).changingThisBreaksApplicationSecurity);
                    this.dsbButton = false;
                }
            }
        }
    }
    //**** close popup ****//
    closePopup = () => {
        this.profilePicModal.hide();
        this.uploadImage = [];
    }

    //*****clear message click on screen anywhere*****//
    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent) {
        this.showSuccessMessage = '';
        this.showUnSuccessMessage = '';
    }
    //*****unique id corresponding to the item*****//
    trackByFn(item) {
        return item.id;
    }
    ngOnDestroy() {
        this.getpasswordupdateSubscription ? this.getpasswordupdateSubscription.unsubscribe() : null;
        //this.GetAllEmployeesRolesSubscription ? this.GetAllEmployeesRolesSubscription.unsubscribe() : null;
        this.switchRoleSubscription ? this.switchRoleSubscription.unsubscribe() : null;
    }
}
