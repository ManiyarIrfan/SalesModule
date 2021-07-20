import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { routerTransition } from 'src/app/router.animations';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';
import { environment } from 'src/environments/environment';
import { error } from 'util';
import Speech from 'speak-tts';
import { interval } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})

export class SignupComponent implements OnInit {
    // @ViewChild('approvedCpModal', { static: false }) public approvedCpModal: ModalDirective;
    @ViewChild('alreadyRegisterModal', { static: false }) public alreadyRegisterModal: ModalDirective;
    public registrationMsg: any;
    public msg: string;
    public isshow: boolean = false;
    public showemail: any = [];
    public showmobile: any;
    public showPan: any;
    public isMobileAvailable: any;
    public isPanAvailable: boolean;
    public isEmailAvailable: any;
    public isLoading: boolean = false;
    public isCaptchValid: boolean = false;
    public signupModel: any = {};
    public emailPattren: any = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    public registerModel: any = {};
    public uploadFilePanCard: FileAttachment[] = [];
    public uploadFileListAdharCard: FileAttachment[] = [];
    public uploaddFileProfile: FileAttachment[] = [];
    public AllOrganisation: any = [];
    public isActive: boolean = false;
    public message: string = "";
    public otpSessionId: any;
    public optVarifiedMessage: string;
    public isSend: boolean = false;
    public isOn: boolean = false;
    public panImageNotSelect: string;
    public adharImageNotSelect: string;
    public isPanImage: boolean;
    public channelpartnerName: any = [];
    public successfullySignup: boolean;
    public successfullySignup2: boolean;
    public unsuccessfullySignup: boolean;
    public disableRegisterBtn: boolean;
    public VendorTypes: any = [];
    public isLogin: boolean = true;
    public Phase2Url: string;
    public code1: number;
    public code2: number;
    public answer: number;
    public error: string;
    public static avat: number = 0;
    public chatbotModel: any = {};
    public ShowVerified: boolean = false;
    public HideBotRegistration: boolean = false;
    public talk: boolean = false;
    public devicedetails: any;
    public Country:any=[];
    public State:any[]=[];
    public City:any[]=[];
    public stateBind:any[]=[];
    public cityBind:any[]=[];
    public speech = new Speech();
    public BudgetInfo: any = [
        { key: "0 to 25", value: "0 to 25" },
        { key: "25 to 35", value: "25 to 35" },
        { key: "35 to 45", value: "35 to 45" },
        { key: "45 to 55", value: "45 to 55" },
        { key: "55 to 65", value: "55 to 65" },
        { key: "65 to 75", value: "65 to 75" },
        { key: "75 to 85", value: "75 to 85" },
        { key: "85 to 95", value: "85 to 95" },
        { key: "95 to More than 100", value: "95 to More than 100" }];
    public CptypeInfo: any = [
        { key: "Individual", value: "Individual" },
        { key: "Proprietorship", value: "Proprietorship" },
        { key: "PVT(LTD)", value: "PVT(LTD)" },
        { key: "Other", value: "Other" }];
    public CroType: any = [
        { key: "housewife", value: "Housewife" },
        { key: "student", value: "Student" },
        { key: "traders", value: "Traders" },
        { key: "businessman", value: "Businessman" }];
    public UserInfo: any = [
        { key: "ChannelPartner", value: "ChannelPartner" },
        { key: "CRO", value: "CRO" },               // Customer Relationship Officer       
        { key: "Supplier", value: "Supplier / Vendor" },
        { key: "Contractor", value: "Contractor" },
        { key: "Consultant", value: "Consultant" },
        { key: "Customer", value: "Customer" }];
    public ownedFlatInfo: any = [
        { key: "No", value: "No" },
        { key: "Yes", value: "Yes" }];
    public Rupees: any = [
        { key: "Hundreds", value: "Hundreds" },
        { key: "Thousands", value: "Thousands" },
        { key: "Lakhs", value: "Lakhs" },
        { key: "Crores", value: "Crores" }];
    public PancardTypeList: any = [
        { key: "Individual", value: "Individual" },
        { key: "Hindu Un-divided Family", value: "Hindu Un-divided Family" },
        { key: "Association Of Persons", value: "Association Of Persons" },
        { key: "Body Of Individuals", value: "Body Of Individuals" },
        { key: "Company", value: "Company" },
        { key: "Government", value: "Government" },
        { key: "Artificial Juridicial Person", value: "Artificial Juridicial Person" },
        { key: "Loan Authority", value: "Loan Authority" },
        { key: "Firm", value: "Firm" },
        { key: "Trust", value: "Trust" },
    ];
    public deviceInfo:any;
    constructor(public signupservice: SignUpService, public snackBar: MatSnackBar, public deviceService: DeviceDetectorService) { }
    ngOnInit() {

        var _this = this;
        this.HideBotRegistration = true;
        this.ShowVerified = true;
        // chat bot  
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

        if (!document.getElementById("kommunicate-widget-iframe")) {

            (function (d, m) {
                var defaultSettings = {
                    "defaultBotIds": ["hel-jkzmu"],
                    "defaultAssignee": "hel-jkzmu",
                    "skipRouting": true
                };
                var kommunicateSettings = {

                    "appId": "27fd28945715dda512697e4a2cbcb9666",
                    "sessionTimeout": 7 * 24 * 60 * 60 * 1000,
                    "popupWidget": true,
                    "automaticChatOpenOnNavigation": false,
                    "locShare": true,
                    "emojilibrary": true,
                    "voiceInput": true,
                    "onInit": function () {
                        document.getElementById("kommunicate-widget-iframe") && (document.getElementById("kommunicate-widget-iframe").style.display = "none");

                        (window as any).Kommunicate.updateSettings(defaultSettings);

                        const events = {
                            'onMessageReceived': function (resp) {
                                if (_this.talk && resp.message.message && resp.message.message != "TRU created group Conversations" && resp.message.message != "TRU updated group metadata" && resp.message.message != "Assigned to TRU" && resp.message.message.length < 400) {
                                    if (resp.message.message == 'support@trurealty.in') {
                                        resp.message.message = 'support at the rate trurealty dot in';
                                    }
                                    _this.speech.speak({
                                        text: resp.message.message,
                                        listeners: {
                                            onstart: () => {
                                                _this.videoplay();
                                            },
                                            onend: () => {
                                                _this.videopause();
                                            }
                                        }
                                    });
                                }
                            },
                            'onMessageSent': function (resp) {
                            }
                        };
                        (window as any).Kommunicate.subscribeToEvents(events);
                    }
                };
                var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
                s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
                var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
                (window as any).kommunicate = m; m._globals = kommunicateSettings;
            })(document, (window as any).kommunicate || {});

        }
        setTimeout(function () {
            interval(300).subscribe(x => {
                if ((window as any).KommunicateGlobal) {
                    if ((window as any).KommunicateGlobal.document.getElementById('mck-sidebox') && document.getElementById('speaker') != null) {
                        if ((window as any).KommunicateGlobal.document.getElementById('mck-sidebox').style.display == 'none' || (window as any).KommunicateGlobal.document.getElementById('mck-sidebox').style.display == '') {
                            document.getElementById('speaker').style.display = 'none';
                        }
                        else {
                            document.getElementById('speaker').style.display = 'block';
                        }
                    }
                }

            });
        }, 5000);
        //   end
        this.registerModel.isOwnedFlat = this.ownedFlatInfo[0].value;
        this.registerModel.userType = "";
        this.registerModel.Conbudget = "";
        this.registerModel.Budget = "";
        this.registerModel.Type = "";
        this.registerModel.PancardType = "";
        this.registerModel.crotype = "";
        this.registerModel.country= "";
        this.registerModel.State= "";
        this.registerModel.City= "";
        this.getOrganisationNames();
        this.getCaptcha()
    }
    // ***** for Random Number come For Calculations ***** // 
    getCaptcha = () => {
        this.code1 = Math.floor((Math.random() * 20) + 1);
        this.code2 = Math.floor((Math.random() * 20) + 1);
        this.answer = null;
    }
    getOrganisationNames = () => {
        this.signupservice.getAllOrgnisation().subscribe((response) => {
            if (response && response["data"]) {
                this.AllOrganisation = response["data"][1];
            }
        });
    }
    getEmailValidation = (email) => {
        if (email && email !== undefined) {
            var emailpattern: any = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$/;
            this.showemail = [];
            if (email && emailpattern.test(String(email).toLowerCase())) {
                this.signupservice.getEmailValidation(email).subscribe((response) => {
                    if (response && response["data"] && response["data"][0]) {
                        this.isEmailAvailable = (response["data"][0].IsAvailable === 'Available');
                        this.showemail['check'] = response["data"][0].IsAvailable;
                        this.showemail['usertype'] = response["data"][0].IsAvailable === 'Available' ? null : response["data"][0]['UserType'];
                        (this.isEmailAvailable === false && this.showemail['usertype'] !== 'Employee') ? this.alreadyRegisterModal.show() : null;
                    }
                });
            } else {
                this.showemail = [];
            }
        }
    }
    getMobileValidation = (mobile) => {
        var mobilepattern: any = /^\d{10}$/;
        if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
            this.signupservice.getMobileValidation(mobile).subscribe((response) => {
                if (response && response["data"] && response["data"][0]) {
                    this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
                    this.showmobile = response["data"][0].IsAvailable;
                    this.isshow = true;
                }
            });
        } else {
            this.showmobile = "";
        }
    }
    // validate pancard details
    getPanValidation = (panno) => {
        this.signupservice.getPanValidation(panno).subscribe((response) => {
            if (response && response["data"] && response["data"][0]) {
                this.isPanAvailable = (response["data"][0].IsAvailable === 'Available');
                this.showPan = response["data"][0].IsAvailable;
            }
        });
    }

    OnRegisterBtnClick = (registerModel, uploadFileListAdharCard, uploadFilePanCard, signupForm,) => {
        let deviceDetails = localStorage.devicedetails;
        this.error = null;
        this.isLoading = true;
        if ((this.code1 + this.code2) == this.answer) {
            // this.isCaptchValid = true;
            this.disableRegisterBtn = true;
            registerModel.fname = this.toTitleCase(registerModel.fname);
            registerModel.lname = registerModel.lname ? this.toTitleCase(registerModel.lname) : null;
            this.signupservice.insertRegisterDetails(registerModel, uploadFileListAdharCard, uploadFilePanCard, deviceDetails).subscribe((response) => {
                if (response && response['successful'] && (response["data"] === 'Verification pending' || response["data"] === 'Rejected')) {
                    this.snackBar.open('You can not register because your verification status is' + ' ' + response["data"] + ' ' + '.Our team will verify your details soon.', null, { duration: 8000, panelClass: ['red-snackbar'] });
                }
                else {
                    if (response && response['successful'] && response["data"][0]) {
                        if (registerModel.userType === 'ChannelPartner' && response["data"][0]['TRUPayVirtualId']) {
                            this.insertIntoAccounts(response["data"][0]);
                        }
                        this.successfullySignup = true;
                    } else {
                        this.unsuccessfullySignup = true;
                    }
                }
                this.disableRegisterBtn = false;
                let setUserType = String;
                this.uploadFileListAdharCard = [];
                this.uploadFilePanCard = [];
                this.registerModel = [];
                this.registerModel.Type = "";
                this.registerModel.PancardType = "";
                this.registerModel.Budget = "";
                this.getCaptcha();
                this.isLoading = false;
                this.isMobileAvailable = null;
                this.isEmailAvailable = null;
                this.isPanAvailable = false;
                this.showPan = null;
                this.showemail = [];
                this.showmobile = "";
                // signupForm.form.markAsPristine();
                // signupForm.form.markAsUntouched();
                signupForm.reset();
                // this.UserInfo;
                this.registerModel["userType"] = '';
            });
        } else {
            // this.isCaptchValid = false;
            this.error = "Wrong Answer.Please Enter Correct Answer";
            this.getCaptcha();
            this.answer = null;
            this.isLoading = false;
        }
    }
    // ***** Insert into Accounts for Cp Referral ******//
    insertIntoAccounts = (CpModel) => {
        CpModel.Module = 'Sales';
        this.signupservice.insertVirtualDetails(CpModel).subscribe((response) => {
            if (response && response["successful"]) { }
        });
    }

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    // for phase-2 Employees registration
    registerPhasetwoEmp = (registerModel, uploaddFileProfile, signupForm) => {
        this.error = null;
        this.isLoading = true;
        if ((this.code1 + this.code2) == this.answer) {
            this.disableRegisterBtn = true;
            this.registerModel.Action = "VENDOR";
            let profileArray = [];
            registerModel.fname = this.toTitleCase(registerModel.fname);
            registerModel.lname = registerModel.lname ? this.toTitleCase(registerModel.lname) : null;
            (uploaddFileProfile && uploaddFileProfile.length > 0) ? profileArray.push(uploaddFileProfile[uploaddFileProfile.length - 1]) : [];
            this.signupservice.registerPhasetwoEmployee(registerModel, profileArray).subscribe((response) => {
                if (response && response["successful"]) {
                    this.Phase2Url = environment.executionDevUrl;
                    this.successfullySignup2 = true;
                    this.disableRegisterBtn = false;
                } else {
                    this.unsuccessfullySignup = true;
                }
                this.registerModel = [];
                this.getCaptcha();
                this.isLoading = false;
                this.isMobileAvailable = null;
                this.isEmailAvailable = null;
                this.isPanAvailable = false;
                this.showPan = null;
                this.showemail = [];
                this.showmobile = "";
                // signupForm.form.markAsPristine();
                // signupForm.form.markAsUntouched();
                signupForm.reset();
                // this.UserInfo;
                this.registerModel["userType"] = '';
            });
        } else {
            // this.isCaptchValid = false;
            this.error = "Wrong Answer.Please Enter Correct Answer";
            this.getCaptcha();
            this.answer = null;
            this.isLoading = false;
        }
    }

    onChange(selectedOption) {
        switch (selectedOption) {
            // case "Yes":
            //     {
            //         this.isActive = true;
            //         this.message = "To register as A Customer, Please contact the office with your Flat Details.";
            //     }
            //     break;
            case "Customer":
                {
                    this.registerModel.isOwnedFlat = this.ownedFlatInfo[0].value;
                    this.isActive = false;
                }
                break;
            // case "Employee":
            //     {
            //         this.isActive = true;
            //         this.message = "To register as A Employee please contact The Administrator.";
            //     }
            //     break;
            case "Consultant":
                {
                    this.isLogin = false;
                    this.getallvendors();
                    this.registerModel.VendorType = "";
                    this.GetallCountry();
                    this.isActive = false;
                }
                break;
            case "Contractor":
                {
                    this.isLogin = false;
                    this.isActive = false;
                    this.GetallCountry();
                }
                break;
            case "Supplier":
                {
                    this.isLogin = false;
                    this.isActive = false;
                    this.GetallCountry();
                }
                break;
            default:
                this.isLogin = true;
                this.isActive = false;
                break;
        }
        this.successfullySignup2 = false;
        this.successfullySignup = false;
        this.showPan = ''
    }
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }
    public resolved(captchaResponse: string) {
        // this.isCaptchValid = true;
    }

    // geCpReferredCheck = (mobileNo) => {
    //     //******* check mobile number is avaiable in Cp Referral ******///
    //     this.signupservice.cpReferralApprovedCheck(mobileNo).subscribe((response) => {
    //         if (response && response['data'].length > 0) {
    //             this.approvedCpModal.show();
    //             this.channelpartnerName = response['data'][0];
    //         }
    //     });
    // }

    getallvendors = () => {
        //******* get all vendor types ******///
        this.signupservice.getVendorTypes().subscribe((response) => {
            this.VendorTypes = response && response['data'].length > 0 ? response['data'] : [];
        });
    }

    // onClose = () => {
    //     //********* Hide Pop up *******/
    //     this.approvedCpModal.hide();
    // }
    // confirmCpReferred = (cpDetails) => {
    //     //******** Confirm the Cp as referred By ********///
    //     this.registerModel.referredCpname = cpDetails.ReferralById;
    //     this.approvedCpModal.hide();
    // }
    // OTPsend = (mobileNo) => {
    //     if (mobileNo) {
    //         this.signupservice.getOtp(mobileNo).subscribe((result) => {
    //             if (result) {
    //                 let data = JSON.parse(result);
    //                 if (data && data.Status) {
    //                     if (data.Status === `Success`) {
    //                         this.otpSessionId = data.Details;
    //                         this.msg = "OTP Send Successfully.";
    //                     } else {
    //                         this.msg = "Plz Enter Correct Mobile Number... ";
    //                     }
    //                 }
    //             }
    //         });
    //     }
    //     this.isSend = true;
    //     this.isOn = true;
    // }
    // verifyOTP = (otp) => {
    //     if (otp && this.otpSessionId !== "") {
    //         this.signupservice.verifyOtp(this.otpSessionId, otp).subscribe((result) => {
    //             if (result) {
    //                 let data = JSON.parse(result);
    //                 if (data && data.Status) {
    //                     if (data.Status === `Success` && data.Details === "OTP Matched") {
    //                         this.optVarifiedMessage = "OTP Verify Done";
    //                     } else {
    //                         this.optVarifiedMessage = "Enter Valid OTP";
    //                     }
    //                 } else {
    //                     this.optVarifiedMessage = "Enter Valid OTP";
    //                 }
    //             }
    //         });
    //     }
    //     this.isOn = false;
    //     this.optVarifiedMessage = "Enter Valid OTP";
    // }

    // chatbot  OTP
    // open OTP popup
    openForm = () => {
        document.getElementById("myForm").style.display = "block";
        document.getElementById("open").style.display = "none";
        document.getElementById("close").style.display = "block";
    }
    // close OTP popup
    closeForm = () => {
        document.getElementById("myForm").style.display = "none";
        document.getElementById("open").style.display = "block";
        document.getElementById("close").style.display = "none";
    }

    // to change number
    changenumber = () => {
        this.ShowVerified = true;
        this.chatbotModel.otp = [];
        document.getElementById('p').style.display = 'block';
        document.getElementById('demoopt2').innerHTML = '';
        document.getElementById('demoopt3').innerHTML = '';
    }

    //send mobile number
    mobile = (mobileNo) => {
        this.ShowVerified = false;
        this.signupservice.getOtp(mobileNo).subscribe((result) => {
            if (!JSON.stringify(result).includes('error')) {
                let Data = JSON.parse(JSON.parse(JSON.stringify(result)));
                if (Data && Data['Status']) {
                    if (Data['Status'] === `Success`) {
                        document.getElementById('p').style.display = 'none';
                        this.otpSessionId = Data['Details'];
                    } else {
                        this.otpSessionId = "";
                    }
                }
            }
        });
    }
    // insert data into enquiry table
    InsertEnquiryDetails = () => {
        this.chatbotModel.Source = 'ChatBot';
        this.chatbotModel.TenantId = 0;
        this.signupservice.insertEnquiry(this.chatbotModel).subscribe((response) => {
            if (response && response["data"]) {
            }
        });
    }

    // verifucation
    otpverification = (otp) => {
        if (otp && this.otpSessionId !== "") {
            this.signupservice.verifyOtp(this.otpSessionId, otp).subscribe((result) => {
                if (result) {
                    let data = JSON.stringify(result)
                    if (!data.includes('error')) {
                        document.getElementById("kommunicate-widget-iframe") && (document.getElementById("kommunicate-widget-iframe").style.display = "block");
                        (window as any).Kommunicate && (window as any).Kommunicate.launchConversation();
                        this.InsertEnquiryDetails();
                        document.getElementById('demoopt3').style.display = 'none';
                        this.HideBotRegistration = false;
                        document.getElementById('demoopt2').innerHTML = 'Phone Number verified Successfully ';
                        document.getElementById('open').style.display = 'none';
                        document.getElementById('close').style.display = 'none';
                    } else {
                        document.getElementById('demoopt3').innerHTML = 'Enter correct OTP';
                    }
                }
                if (error) {
                    document.getElementById('demoopt3').innerHTML = 'Enter correct OTP';
                }
            });
        } else {
            document.getElementById('demoopt3').innerHTML = 'Enter correct OTP';
        }
    }
    // sound button on
    speakerOn() {
        this.talk = false;
        this.speech.cancel();
        document.getElementById('soundon').style.display = 'none';
        document.getElementById('soundoff').style.display = 'block';
    }
    // sound button off
    speakerOff() {
        this.talk = true;
        document.getElementById('soundoff').style.display = 'none';
        document.getElementById('soundon').style.display = 'block';
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
    showcloseavatar() {
        document.getElementById('closeavatar').style.display = 'block';
    }
    hidecloseavatar() {
        document.getElementById('closeavatar').style.display = 'none';
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
    GetallCountry=()=>{
        this.signupservice.GetCountry().subscribe((response) => {
            this.Country = response && response['data'][0].length > 0 ? response['data'][0] : [];
            this.State=response && response['data'][1].length > 0 ? response['data'][1] : [];
            this.City=response && response['data'][2].length > 0 ? response['data'][2] : [];
        });
       }
    
       GetState=(country)=>{
        this.stateBind=this.State.filter(x =>x.CountryId==country);
       }
    
       GetCity=(state)=>{
           this.cityBind=this.City.filter(x=>x.StateId==state);    
       }    
}
