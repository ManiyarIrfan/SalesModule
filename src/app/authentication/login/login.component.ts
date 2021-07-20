import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { routerTransition } from 'src/app/router.animations';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';
import { environment } from 'src/environments/environment';
import Speech from 'speak-tts';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { SocialAuthService } from 'src/app/shared/services/social/socialauth.service';
import { GoogleLoginProvider } from 'src/app/shared/services/social/providers/google-login-provider';
import { FacebookLoginProvider } from 'src/app/shared/services/social/providers/facebook-login-provider';
import { SocialUser } from 'src/app/shared/services/social/entities/social-user';
import { NgxSpinnerService } from 'ngx-spinner';
import { INewModel } from 'src/app/shared/models/Authentication/signup.model';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit, OnDestroy {
    public user: SocialUser = <SocialUser>{};
    public NewAccuser: SocialUser = <SocialUser>{}; public mobile: any;
    public notSuccessfullMessage: string;
    public SuccessfullMessage: string;
    public otpSessionId: any;
    public emailPattren: any = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    public loginModel: any = {};
    public isLoggedIn = true;
    public isLoadingForCP: boolean = false;
    public isShow: boolean = false;
    public isOn: boolean = false;
    public availableSearch: boolean = false;
    public isShowLogin: boolean = false;
    public isShowChangePassword: boolean = false;
    public exceptionMessage: string;
    public executionURL: string = '';
    public static avat: number = 0;
    public speech = new Speech();
    public deviceInfo: any;
    public loggedInuserDetails: any;
    public GotoCommunity: any[] = [];
    public CommunityData: any[] = [];
    public Flag: boolean;
    public EnableCreateAccount: boolean;
    public NewAccModel: INewModel = <INewModel>{};
    public NewAccStep: number = 0;
    public isMobileAvailable: any;
    public showmobile: any;
    public exceptionMessagepopup: string;
    public Email: string;
    public GoToFinance: any[] = [];
    public selectedModule: string;
    public UserInfo: any = [
        { key: "ChannelPartner", value: "ChannelPartner" },
        { key: "CRO", value: "CRO" },               // Customer Relationship Officer       
        { key: "Supplier", value: "Supplier / Vendor" },
        { key: "Contractor", value: "Contractor" },
        { key: "Consultant", value: "Consultant" },
        { key: "Customer", value: "Customer" }];

    @ViewChild('forgetPasswordModal', { static: false }) public forgetPasswordModal: ModalDirective;
    @ViewChild('Warningmodel', { static: false }) public Warningmodel: ModalDirective;

    private _unsubscribeAll: Array<Subscription> = [];
    public Useremail: any;
    public OTPemail: any;
    public Emailflag: boolean;
    public showNum: boolean;
    public Name: any;

    constructor(
        public router: Router,
        public deviceService: DeviceDetectorService,
        private activatedRoute: ActivatedRoute,
        private loginservice: LoginService,
        private authService: SocialAuthService,
        private sharedService: SharedService,
        private spinner: NgxSpinnerService,
        private signupservice: SignUpService) { }

    ngOnInit() {
        this.EnableCreateAccount = false;
        //this.authService.signOut();
        this.user = null;
        // set data for after login in community module     
        this.sharedService.setDiscussionData.subscribe((item) => {
            if (item && item !== null) {
                this.CommunityData = Array.of(item);
            }
        });
        //set Type,Action for after login in community Module
        this.activatedRoute.queryParams.subscribe(Items => {
            if (Items && Items['Module']) {
                if (Items && Items['flag'] && Items['Action'] && Items['Module'] && Boolean(JSON.parse(Items['flag'])) && Items.Action !== '') {
                    if (Items['Module'] === 'community') {
                        if (Boolean(JSON.parse(Items['flag'])) === true && Items.Action !== '') {
                            this.GotoCommunity['flag'] = true;
                            this.GotoCommunity['Type'] = Items.Type;
                            this.GotoCommunity['Action'] = Items.Action;
                            this.selectedModule = 'community';
                        }
                    } else if (Items['Module'] === 'finance') {
                        this.GoToFinance['flag'] = true;
                        this.GoToFinance['Action'] = Items.Action;
                        this.selectedModule = 'finance';
                    }
                    else {
                        this.GotoCommunity['flag'] = false
                    }
                }
            }
        });
        this.spinner.hide();

        if (localStorage.LoggedinUser) {
            var loggedindata = JSON.parse(localStorage.LoggedinUser);
            this.landingPage(loggedindata);
        }
        this.executionURL = environment.executionDevUrl;
        this.speech.init({
            'volume': 1,
            'lang': 'en-GB',
            'rate': 1.1,
            'pitch': 1,
            'voice': 'Google UK English Male',
            'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices) => {
                }
            }
        })
        this.deviceDetails();
    }
    // ******** Check For Latest Deployed Version ******* //
    CheckVersion() {
        this.loginservice.getVersion().subscribe((response) => {
            if (response) {
                let finalVersion = response;
                let versionList = JSON.parse(sessionStorage.getItem('AppVersion'));
                if (versionList) {
                    if (finalVersion["menu"][0]["version"] === versionList["menu"][0]["version"]) {
                        console.log('Application version  : ' + finalVersion["menu"][0]["version"]);
                    } else {
                        console.log('This web application version is unsupported. you are using : ' + finalVersion["menu"][0]["version"]);
                        sessionStorage.setItem('AppVersion', JSON.stringify(finalVersion));
                        location.reload(true);
                    }
                } else {
                    if (finalVersion["menu"][0]["version"] === environment.version) {
                        sessionStorage.setItem('AppVersion', JSON.stringify(finalVersion));
                        console.log('Application version : ' + finalVersion["menu"][0]["version"]);
                    } else {
                        console.log('This web application version is unsupported. you are using : ' + finalVersion["menu"][0]["version"]);
                        sessionStorage.setItem('AppVersion', JSON.stringify(finalVersion));
                        location.reload(true);
                    }
                }
            }
        });
    }
    enterClick = (event) => {
        if (event.keyCode == 13) {
            this.onLoggedin(this.loginModel);
        }
    }
    // register new user
    register = () => {
        this.router.navigate(['/signup'], { queryParams: { Module: this.selectedModule } });
    }
    onLoggedin = (data) => {
        this.isLoadingForCP = true;
        if (localStorage.LoggedinUser) {
            var loggedindata = JSON.parse(localStorage.LoggedinUser);
            this.landingPage(loggedindata);
        } else {
            data['loggedInUrl'] = window.location.href;
            data['deviceDetails'] = localStorage.devicedetails;
            this.loginservice.LoginDetails(data).subscribe((response) => {
                if (response['successful'] && response['data'] != 0) {
                    if (response['exception'] != null) {
                        this.exceptionMessage = response['exception'];
                        const exceptiontest = this.exceptionMessage.split("Email");
                        this.exceptionMessagepopup = exceptiontest[0];
                        this.Email = exceptiontest[1];
                        if (this.exceptionMessagepopup != " " && this.Email != " ") {
                            this.Warningmodel.show();
                        }
                        this.isLoggedIn = true;
                        this.isLoadingForCP = false;
                    } else {
                        this.exceptionMessage = '';
                        this.isLoggedIn = true;
                        response['data'].DeviceDetails = localStorage.devicedetails;
                        localStorage.setItem('isLoggedin', 'true');
                        localStorage.setItem('LoggedinUser', JSON.stringify(response['data']));
                        if (this.selectedModule === 'community') {
                            if (this.GotoCommunity['flag']) {
                                this.router.navigate(['/community'],
                                    {
                                        queryParams:
                                        {
                                            Action: this.GotoCommunity['Action'],
                                            Type: this.GotoCommunity['Type']
                                        }
                                    });
                                if (this.CommunityData.length > 0) {
                                    setTimeout(() => {
                                        this.sharedService.getDiscussions(
                                            {
                                                Action: this.GotoCommunity['Action'],
                                                data: this.CommunityData[0],
                                                Type: this.GotoCommunity['Type']
                                            })
                                    }, 3000);
                                }
                            }
                        } else if (this.selectedModule === 'finance') {
                            if (this.GoToFinance['flag']) {
                                this.router.navigate(['/finance'],
                                    {
                                        queryParams:
                                        {
                                            Action: this.GoToFinance['Action'],
                                            // Type: this.GoToFinance['Type']
                                        }
                                    });
                            }
                        }
                        else {
                            this.landingPage(response['data']);
                        }
                    }
                } else {
                    this.isLoadingForCP = false;
                    this.isLoggedIn = false;
                    localStorage.setItem('isLoggedin', 'false');
                }
            });
        }
    }
    landingPage = (loggedindata) => {
        switch (loggedindata.UserType.toLocaleLowerCase()) {
            case "customer":
                // this.router.navigate(['/customer/view-profile']);
                this.router.navigate(['/customer/customerfeedback']);
                this.isLoadingForCP = false;
                break;
            case "referral":
                // this.router.navigate(['/customer/view-profile']);
                this.router.navigate(['/customer/customerfeedback']);
                this.isLoadingForCP = false;
                break;
            case "employee":
                this.router.navigate(['/employee/home']);
                this.isLoadingForCP = false;
                break;
            case "channelpartner":
                // this.router.navigate(['/channelpartner/referral-status-cp']);
                this.router.navigate(['/customer/customerfeedback']);
                this.isLoadingForCP = false;
                break;
            case "cro":
                // this.router.navigate(['/cro/view-profile-cro']);
                this.router.navigate(['/customer/customerfeedback']);
                this.isLoadingForCP = false;
                break;
        }
        this.CheckVersion();
    }
    deviceDetails = () => {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        if (this.deviceService.isMobile()) {
            this.deviceInfo['System'] = 'Mobile';
        } else if (this.deviceService.isDesktop()) {
            this.deviceInfo['System'] = 'Desktop';
        } else {
            this.deviceInfo['System'] = 'Tablet';
        }
        this.deviceInfo['Module'] = 'phase1';
        localStorage.setItem('devicedetails', JSON.stringify(this.deviceInfo));
    }
    clearErrorMessage = () => {
        this.exceptionMessage = '';
        this.isLoggedIn = true;
    }
    checkSearchEmpty = () => {
        if (this.loginModel.Search) {
            this.availableSearch = true;
        }
    }
    // **** Otp Send to registered Mobile Numeber **** //
    OTPsend = (mobileNo) => {
        if (mobileNo) {
            this.signupservice.getOtp(mobileNo).subscribe((result) => {
                if (result) {
                    let data = JSON.parse(result.toString());
                    if (data && data.Status && data.Status.toLocaleLowerCase() === `success`) {
                        this.otpSessionId = data['Details'];
                        this.SuccessfullMessage = "OTP Send Successfully.";
                        this.NewAccModel.spinnerFlag = this.isShow = true;
                    } else {
                        this.otpSessionId = "";
                    }
                }
            });
        }
    }
    resetForm() {
        this.isShowChangePassword = this.showNum = this.isShow = false;
        this.Name = "";
        this.Useremail = "";
        this.isShowLogin = false;
    }
    // **** Verify otp **** //
    verifyOTP = (otp) => {
        if (otp && this.otpSessionId !== "") {
            this.signupservice.verifyOtp(this.otpSessionId, otp).subscribe((result) => {
                if (result) {
                    let data = JSON.parse(result.toString());
                    if (data['Status'].toLocaleLowerCase() === `success` && data['Details'].toLocaleLowerCase() === "otp matched") {
                        this.SuccessfullMessage = "OTP Verify Done ";
                        this.isShowChangePassword = true;
                        this.isShow = false;
                        this.NewAccStep = 4;
                        if (this.NewAccModel !== null) {
                            this.registerNew(this.NewAccModel);
                        }
                    } else {
                        this.notSuccessfullMessage = "Enter Valid OTP";
                    }
                } else {
                    this.notSuccessfullMessage = "Enter Valid OTP";
                }
            });
        } else {
            this.notSuccessfullMessage = "Enter Valid OTP";
        }
        this.isOn = true;
    }
    showForgetPassword = () => {
        this.forgetPasswordModal.show();
        this.resetForm();
        this.loginModel.Search = "";
    }
    submitEmailNumber = (Search) => {
        this.showNum = true;
        if (Search) {
            this.loginservice.getNumber(Search).subscribe((response) => {
                if (response) {
                    if (response['exception']) {
                        this.notSuccessfullMessage = "Please,Enter Valid Email Id or Mobile Number";
                    }
                    if (response['data'][0].MobileNo) {
                        this.mobile = response['data'][0].MobileNo;
                        //this.OTPsend(this.mobile);
                        this.Useremail = response['data'][0].UserId;
                        this.Name = response['data'][0].Name;
                    }
                    this.availableSearch = true;
                }
            });
        }
        this.isOn = true;
        this.clearMessage();
    }
    Resetpass = (Search) => {
        //this.shownum=false;
        if (Search) {
            this.loginservice.getNumber(Search).subscribe((response) => {
                if (response) {
                    this.Useremail = response['data'][0].UserId;

                    if (response['exception']) {
                        this.notSuccessfullMessage = "Please,Enter Valid Email Id or Mobile Number";
                    }
                    if (response['data'][0].MobileNo) {
                        this.mobile = response['data'][0].MobileNo;
                        // this.isShow = true;
                        this.OTPsend(this.mobile);
                    }
                    this.availableSearch = true;
                }
            });
        }
    }
    cleardata = () => {
        if (this.loginModel.Search === "") {
            this.showNum = false;
        }
    }
    changePassword = (forgetPasswordForm) => {
        this.loginservice.updatePassword(this.loginModel).subscribe((response) => {
            if (response['successful']) {
                this.SuccessfullMessage = "Your Password changed.";
                this.clearModel(forgetPasswordForm);
                this.isShowLogin = true;
                this.isShowChangePassword = false;
                this.resetForm();
            }
        });
        this.isOn = true;
        this.clearMessage();
    }
    redirectToLogin = (forgetPasswordForm) => {
        this.signupservice.logoutDetails(JSON.parse(localStorage.getItem('LoggedinUser')), 'LOGOUT').subscribe((response) => {
            if (response) { }
        });
        localStorage.removeItem('isLoggedin');
        localStorage.removeItem('LoggedinUser');
        this.onClose(forgetPasswordForm);
        this.clearMessage();
        this.router.navigate(['/login']);
    }
    clearMessage = () => {
        this.SuccessfullMessage = this.notSuccessfullMessage = "";
    }
    clearModel = (forgetPasswordForm) => {
        this.loginModel = {};
        forgetPasswordForm.form.markAsPristine();
        forgetPasswordForm.form.markAsUntouched();
    }
    onClose = (forgetPasswordForm) => {
        this.forgetPasswordModal.hide();
        this.clearModel(forgetPasswordForm);
        this.clearMessage();
    }
    videoplay() {
        var vid = <HTMLVideoElement>document.getElementById("avatar");
        vid.playbackRate = 1.5;
        vid.play();
        document.getElementById('avatarimg').style.display = 'none';
        document.getElementById('avatar').style.display = 'block';
    }
    videopause() {
        var vid = <HTMLVideoElement>document.getElementById("avatar");
        vid.pause();
        document.getElementById('avatarimg').style.display = 'block';
        document.getElementById('avatar').style.display = 'none';
    }
    closeavatar() {
        this.speech.cancel();
        document.getElementById('avatar').style.display = 'none';
        document.getElementById('closeavatar').style.display = 'none';
        document.getElementById('playavatar').style.display = 'none';
        setTimeout(function () {
            document.getElementById('avatarimg').style.display = 'none';
        }, 200);
    }
    showcloseavatar() {
        document.getElementById('closeavatar').style.display = 'block';
    }
    hidecloseavatar() {
        document.getElementById('closeavatar').style.display = 'none';
    }
    playavatar() {
        let vid = <HTMLVideoElement>document.getElementById("avatar");
        document.getElementById('playavatar').style.display = 'none';
        if (new Date().getHours() >= 6 && new Date().getHours() < 12) {
            var avatarSpeech = "Good morning.   I am virtual assistant of Tru reality.  For any queries, you can  chatt  from  the  chatt  widget present  in the right bottom corner of the website,  after login  as  well  as   in the registration page.";
        }
        else
            if (new Date().getHours() >= 12 && new Date().getHours() < 17) {
                var avatarSpeech = "Good afterrnoon.   I am virtual assistant of Tru reality.  For any queries, you can  chatt  from  the  chatt  widget present  in the right bottom corner of the website,  after login  as  well  as   in the registration page.";
            }
            else
                if (new Date().getHours() >= 17 && new Date().getHours() < 20) {
                    var avatarSpeech = "Good evening.   I am virtual assistant of Tru reality.  For any queries, you can  chatt  from  the  chatt  widget present  in the right bottom corner of the website,  after login  as  well  as   in the registration page.";
                }
                else {
                    var avatarSpeech = "Welcome to my website.   I am virtual assistant of Tru reality.  For any queries, you can  chatt  from  the  chatt  widget present  in the right bottom corner of the website,  after login  as  well  as   in the registration page. Good night.";
                }
        this.speech.speak({
            text: avatarSpeech,
            listeners: {
                onstart: () => {
                    this.videoplay();
                },
                onend: () => {
                    this.videopause();
                }
            }
        });
    }
    getMobileValidation = (mobile) => {
        var mobilepattern: any = /^\d{10}$/;
        if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
            const getMobVer = this.signupservice.getMobileValidation(mobile)
                .subscribe((response) => {
                    if (response && response["data"] && response["data"][0]) {
                        this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
                        this.showmobile = response["data"][0].IsAvailable;
                        this.isShow = true;
                    }
                });
            this._unsubscribeAll.push(getMobVer);
        } else {
            this.showmobile = "";
        }
    }

    // login for Facebook,Google
    socialsignIn = (Action): void => {
        //  this.authService.signOut();
        this.user = <SocialUser>{};
        let UserData = [];
        this.Flag = true;
        this.NewAccModel.Provider = Action;
        switch (Action) {
            case 'Google':
                this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
                break;
            case 'Facebook':
                this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
                break;
        }
        this.authService.authState.subscribe((user) => {
            this.user = user;
            if (this.user && this.user.email !== '') {
                UserData['email'] = user.email;
                UserData['Provider'] = user.provider;
                UserData['Token'] = user.idToken || user.authToken;
                UserData['Password'] = user.id;
                const socialLoginSub = this.loginservice.LoginDetails(UserData)
                    .subscribe((response) => {
                        if (response['successful'] && response['data'] != 0) {
                            if (response['exception'] != null) {
                                this.exceptionMessage = response['exception'];
                                this.isLoggedIn = true;
                                this.isLoadingForCP = false;
                            } else {
                                this.exceptionMessage = '';
                                this.isLoggedIn = true;
                                localStorage.setItem('isLoggedin', 'true');
                                localStorage.setItem('LoggedinUser', JSON.stringify(response['data']));
                                if (this.GotoCommunity['flag']) {
                                    this.router.navigate(['/community'],
                                        {
                                            queryParams:
                                            {
                                                Action: this.GotoCommunity['Action'],
                                                Type: this.GotoCommunity['Type']
                                            }
                                        });
                                    if (this.CommunityData.length > 0) {
                                        setTimeout(() => {
                                            this.sharedService.getDiscussions(
                                                {
                                                    Action: this.GotoCommunity['Action'],
                                                    data: this.CommunityData[0],
                                                    Type: this.GotoCommunity['Type']
                                                })
                                        }, 3000);
                                    }
                                } else {
                                    this.landingPage(response['data']);
                                }
                            }
                        } else {
                            if (response['successful'] === false && response['exception'] != null) {
                                this.EnableCreateAccount = true;
                                this.NewAccuser = this.user;
                                this.NewAccStep = 1;
                                this.NewAccModel.Email = this.user.email;
                                this.NewAccModel.LastName = this.user.lastName;
                                this.NewAccModel.FirstName = this.user.firstName;
                                this.NewAccModel.ProfilePic = this.user.photoUrl;
                                this.NewAccModel.idToken = this.user.idToken;
                                this.NewAccModel.Pwd = this.user.id;
                            }
                            this.isLoadingForCP = false;
                            this.isLoggedIn = false;
                            localStorage.setItem('isLoggedin', 'false');
                        }
                    });
                this._unsubscribeAll.push(socialLoginSub);
            }
        });
    }

    signOut(): void {
        this.authService.signOut();
    }

    registerNew = (userData) => {
        //  this.NewAccModel.spinnerFlag = true;
        const SocialRegSub = this.loginservice.registerNewUser(userData)
            .subscribe((response) => {
                if (response['successful'] && response['data'] != 0) {
                    if (response['exception'] != null) {
                        this.exceptionMessage = response['exception'];
                        this.isLoggedIn = true;
                        this.isLoadingForCP = this.NewAccModel.spinnerFlag = this.NewAccModel.Success = false;
                    } else {
                        this.NewAccModel.spinnerFlag = false;
                        this.NewAccModel.Success = true;
                        setTimeout(() => {
                            this.exceptionMessage = '';
                            this.isLoggedIn = true;
                            this.spinner.show();
                            localStorage.setItem('isLoggedin', 'true');
                            localStorage.setItem('LoggedinUser', JSON.stringify(response['data']));
                            if (this.GotoCommunity['flag']) {
                                this.router.navigate(['/community'],
                                    {
                                        queryParams:
                                        {
                                            Action: this.GotoCommunity['Action'],
                                            Type: this.GotoCommunity['Type']
                                        }
                                    });
                                if (this.CommunityData.length > 0) {
                                    setTimeout(() => {
                                        this.sharedService.getDiscussions(
                                            {
                                                Action: this.GotoCommunity['Action'],
                                                data: this.CommunityData[0],
                                                Type: this.GotoCommunity['Type']
                                            })
                                    }, 3000);
                                }
                            } else {
                                this.landingPage(response['data']);
                            }
                        }, 1000);
                    }
                }
            });
        this._unsubscribeAll.push(SocialRegSub);
    }

    // unique id corresponding to the item
    trackByFn(item) {
        return item.id;
    }
    SendEmail = (data) => {
        this.OTPemail = data ? data : null;
        const SendEmailSubscription = this.loginservice.sendEmailService(this.OTPemail).subscribe((response) => {
            if (response && response['data'] && response['data'].length > 0) {
                this.SuccessfullMessage = "Password sent to email";
                this.isShowLogin = true;
            } else {
                this.notSuccessfullMessage = "Email Not Sent";
            }
        });
        this._unsubscribeAll.push(SendEmailSubscription)
    }
    ngOnDestroy() {
        this._unsubscribeAll.map((item) => item.unsubscribe());
        this._unsubscribeAll = [];

    }
}