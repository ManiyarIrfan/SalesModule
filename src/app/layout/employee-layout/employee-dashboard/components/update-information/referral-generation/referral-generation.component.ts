import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { LeadGenerationService } from 'src/app/shared/services/employee/lead-generation.service';
import { routerTransition } from 'src/app/router.animations';
import { IrefModel } from 'src/app/shared/models/employeeModel/referalGeneration.model';
import { MatSnackBar } from '@angular/material';
import { EoipdfService } from 'src/app/shared/services/shared/eoipdf.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
    selector: 'tru-referral-generation',
    templateUrl: './referral-generation.component.html',
    styleUrls: ['./referral-generation.component.scss'],
    animations: [routerTransition()]
})
export class ReferralGenerationComponent implements OnInit, OnChanges, OnDestroy {
    @Input() details: any = [];
    @ViewChild('userSelectionModal', { static: false }) public userSelectionModal: ModalDirective;
    public refModel: IrefModel = <IrefModel>{};
    public isMobileAvailable: boolean;
    public isPriorityNoAvailable: boolean;
    public showmobile: string;
    public isshow: boolean;
    public isEmailAvailable: boolean;
    public showemail: string;
    public PreferredAreaInfo: string[] = [];
    public PreferredProjectInfo: string[] = [];
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public isSpinnerActive: boolean = false;
    public showGroup: boolean = false;
    public isEdit: boolean = false;
    public selectedTime: string;
    public employeeName: string;
    public Role: number = 3;
    public enableSource: boolean = false;
    public campaignInfo: string[] = [];
    public sourceInfo: string[] = [];
    public SalesAgentAssignedId: number;
    public leadDetails: object[] = [];
    public storeCPName = [];
    public storeCRONames = [];
    public disableFields: boolean = false;
    public emailValidationSubscription: Subscription;
    public mobileValidationSubscription: Subscription;
    public mobileValidationSubscriptions: Subscription;
    public preferredProjectAreaSubscription: Subscription;
    public preferedAreaSubscription: Subscription;
    public submitBtnSubscription: Subscription;
    public getUserDetailsOnMobileSubscription: Subscription;
    public submitEOISubscription: Subscription;
    public prirityNoSubscription: Subscription;
    public insertInVirtualWalletSubscription: Subscription;
    public paymentlinkForEOISubscription: Subscription;
    public onScreenLoadGetDataSubscription: Subscription;
    public paymentType: any = [{ key: "Cheque", value: "Cheque" },
    { key: "Tru Pay", value: "Tru Pay" },];

    public OccupationInfo: any = [
        { key: "Service", value: "Service" },
        { key: "Business", value: "Business" },
        { key: "Retirement", value: "Retirement" },
        { key: "Consultant", value: "Consultant" },
        { key: "House-wife", value: "House-wife" }];
    public RequirementInfo: any = [
        { key: "Residential", value: "Residential" },
        { key: "Commercial", value: "Commercial" },
        { key: "IT Park", value: "IT Park" },
        { key: "Plots", value: "Plots" }];
    public BhkInfo: any = [
        { key: "1 BHK", value: "1 BHK" },
        { key: "2 BHK", value: "2 BHK" },
        { key: "2 or 2.5 BHK", value: "2 or 2.5 BHK" },
        { key: "2 or 3 BHK", value: "2 or 3 BHK" },
        { key: "2.5 BHK", value: "2.5 BHK" },
        { key: "2.5 or 3 BHK", value: "2.5 or 3 BHK" },
        { key: "3 BHK", value: "3 BHK" },
        { key: "3.5 BHK", value: "3.5 BHK" },
        { key: "4 BHK", value: "4 BHK" },
        { key: "4.5 BHK", value: "4.5 BHK" },
        { key: "5 BHK", value: "5 BHK" },
        { key: "Bunglow plots", value: "Bunglow plots" },
        { key: "Twin Bunglow", value: "Twin Bunglow" },
        { key: "Duplex", value: "Duplex" },
        { key: "Row House", value: "Row House" }];
    public CommercialInfo: any = [
        { key: "Shop", value: "Shop" },
        { key: "Showroom", value: "Showroom" },
        { key: "Office Space", value: "Office Space" },
        { key: "Land Plot", value: "Land Plot" },
        { key: "Hotel/Resort", value: "Hotel/Resort" },
        { key: "Warehouse", value: "Warehouse" },
        { key: "Retail Mall", value: "Retail Mall" }];
    public IT_ParkInfo: any = [
        { key: "IT Park", value: "IT Park" },
        { key: "SEZ", value: "SEZ" },
        { key: "Business Park", value: "Business Park" }];
    public PlotInfo: any = [
        { key: "2500sqft To 3000sqft", value: "2500sqft To 3000sqft" },
        { key: "3000sqft To 3500sqft", value: "3000sqft To 3500sqft" },
        { key: "3500sqft To 4000sqft", value: "3500sqft To 4000sqft" },
        { key: "4000sqft To 4500sqft", value: "4000sqft To 4500sqft" },
        { key: "5000sqft+", value: "5000sqft+" }];
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
    public preferredCityInfo: any = [
        { key: "Pune", value: "Pune" },
        { key: "Mumbai", value: "Mumbai" },
        { key: "Nashik", value: "Nashik" }];
    public AccountTypeInfo: any = [
        { key: "Saving", value: "Saving" },
        { key: "NRE", value: "NRE" },
        { key: "NRO", value: "NRO" }];
    public allCPNames: any = [];
    public disableSubmitBtn: boolean = false;
    public allCRONames: any = [];
    public msg: string = '';
    public updateReferral: boolean = false;
    public storeSourceData: any = [];
    public disabledPriority: boolean = false;
    public RoleFlag: boolean;
    public showme: boolean = true;  //flag for mobile number

    constructor(public router: Router, private leadGenerationService: LeadGenerationService,
        private atp: AmazingTimePickerService,
        private snackBar: MatSnackBar, private eoipdfService: EoipdfService,) { }

    ngOnInit() {
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
        this.RoleFlag = (this.loggedInuserDetails.Role === 3 || this.loggedInuserDetails.Role === 7) ? false : true;
        if (this.refModel.Source == undefined) {
            this.refModel.Source = "";
            this.refModel.refOccupation = "";
            this.refModel.budget = "";
            this.refModel.SalesAgentAssignedId = "";
            this.refModel.Campaign = "";
            this.refModel.PaymentType = "";
        }
        this.refModel.preCity = "Pune";
        this.refModel.requireType = "Residential";
        this.refModel.refCity = "Pune";
        this.refModel.refState = "Maharashtra";
       this.refModel.refCountryCode = null;
        this.onScreenLoadGetData()
        this.GetPreferedAreaByCity(this.refModel.preCity);  // on init preferred area list should Populate
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.details && this.details) {
            this.referralInfoDisplay(this.details)
        }
    }

    onScreenLoadGetData = () => {
        const sourceCampaign = this.leadGenerationService.getSourceCampaign(this.loggedInuserDetails, null);
        const allEmployeeName = this.leadGenerationService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, this.Role);
        const allCp = this.leadGenerationService.allCpNames(this.loggedInuserDetails);
        const allCRO = this.leadGenerationService.allCRONames(this.loggedInuserDetails, 'CRO');
        this.onScreenLoadGetDataSubscription = forkJoin([sourceCampaign, allEmployeeName, allCp, allCRO]).subscribe((response) => {
            if (response) {
                if (response[0]) {
                    this.campaignInfo = response[0]["data"].filter(x => x.Type === 'Campaign');
                    this.sourceInfo = response[0]["data"].filter(x => x.Type === 'Source');
                    this.storeSourceData = this.sourceInfo.filter(a => {
                        return a['Name'] === 'Channel Partner Referral' ? a['Name'] = 'Channel Partner' : 'Channel Partner Referral';
                    });
                }

                //-------Get All Employee Name In Sales Agent Assign-------//
                this.employeeName = response[1] ? response[1]["data"] : [];

                // ******* All Cp Names  ******** //
                this.allCPNames = response[2]['data'];
                if (this.allCPNames.length > 0) {
                    this.allCPNames.forEach(element => {
                        this.storeCPName.push({ name: (element.Organization ? element.Organization : 'NA') + ' - ' + ((element.Name && element.Name !== " ") ? element.Name : 'NA'), code: element.BrokerId });
                    });
                }
                else
                    this.storeCPName = [];

                // ******* All Cp Names  ******** //
                if (response && response[3]['data'].length > 0) {
                    this.allCRONames = response[3]['data'];
                    if (this.allCRONames.length > 0) {
                        this.allCRONames.forEach(element => {
                            this.storeCRONames.push({ name: element.CROName, code: element.CROId });
                        });
                    }
                    else
                        this.storeCRONames = [];
                }
            }
        });
    }
    onEOICheck = (event) => {
        this.disableFields = (event.checked === true) ? true : false;
    }
    validatePriorityNo = (number) => {
        this.prirityNoSubscription = this.leadGenerationService.checkDuplicateNo(number).subscribe((response) => {
            if (response && response["data"] && response["data"][0]) {
                this.msg = response["data"][0]['IsAvailable'] ? response["data"][0]['IsAvailable'] : null;
                this.isPriorityNoAvailable = (response["data"][0]['IsAvailable'] === 'Available') ? true : false;
            }
        });
    }
    referralInfoDisplay = (details) => {
        this.refModel.refFirst = details.FirstName;
        this.refModel.refLast = details.LastName;
        this.refModel.refMobileNo = details.MobileNo;
        this.refModel.refCountryCode = details.CountryCode ? details.CountryCode : null;
        this.disableSubmitBtn = this.refModel.refMobileNo === null || this.refModel.refMobileNo === undefined ? false : true;
        // this.getMobileValidation(details.MobileNo);
        this.refModel.refLandline = details.AlternateNo;
        if (details.Email === "" || details.Email === null || details.Email === undefined) {
            details.Email = this.refModel.refMobileNo + "@trurealty.in"; // Email is blank, Null or undefined then replace it with mobileNumber@trurealty.in
        }
        this.refModel.refEmail = details.Email;
        // this.getEmailValidation(details.Email);
        this.refModel.refOccupation = details.Occupation;
        this.refModel.refAddress1 = details.Address;
        this.refModel.refCity = details.City;
        this.refModel.Source = details.Source;
        this.refModel.requireType = details.RequirementType;
        this.refModel.comm_options = details.CommercialOption;
        this.refModel.it_options = details.ITOption;
        this.refModel.bhk = details.BHK;
        this.refModel.budget = details.Budget;
        this.refModel.preCity = details.PreferredCity;
        this.GetPreferedAreaByCity(this.refModel.preCity); //when city is selected bydefault then prefered area list is populated
        this.refModel.PreferredArea = details.PreferredLocation;
        this.GetPreferedProjectByArea(this.refModel.PreferredArea);
        this.refModel.PreferredProject = details.PreferredProject;
        this.refModel.Possession = details.Possession;
        this.refModel.EnquiryId = details.EnquiryId ? details.EnquiryId : details.UserType === 'Enquiry' ? details.LeadId : null;
        this.refModel.SalesAgentAssigned = details.SalesAgentAssigned;
        this.refModel.SalesAgentAssignedId = details.SalesAgentAssignedId;
        this.refModel.preTime = details.PreferredTime;
        this.refModel.preDate = details.PreferredDate;
        this.refModel.Campaign = details.Campaign;
        this.refModel.PlotSize = details.PlotSize;
        this.refModel.TokenBankName = details.TokenBankName;
        this.refModel.TokenChequeNo = details.TokenChequeNo;
        this.refModel.TokenAmount = details.TokenAmount;
        this.refModel.TokenChequeDate = details.TokenChequeDate ? details.TokenChequeDate.split('T')[0] : null;
        this.refModel.rName1 = details.rName1;
        this.refModel.rMobile1 = details.rMobile1;
        this.refModel.rName2 = details.rName2;
        this.refModel.rMobile2 = details.rMobile2;
        this.refModel.bName = details.BeneficiaryName;
        this.refModel.BankName = details.BankName;
        this.refModel.Branch = details.Branch;
        this.refModel.AccountNo = details.AccountNo;
        this.refModel.IFSC = details.IFSC;
        this.refModel.AccountType = details.AccountType;
        this.refModel.RefPanNo = details.AccountType;
        this.refModel.AccountType = details.AccountType;
        this.refModel.PinCode = details.Pincode;
        this.refModel.RefPanNo = details.PANNo;
        this.refModel.Priority = details.Priority;
        this.refModel.AdharNo = details.AdharCard;
        this.disabledPriority = (details.Priority && details.Priority !== '') ? true : false;
        this.disableFields = this.isPriorityNoAvailable = (details.Priority && details.Priority !== '') ? true : false;
        this.enableSource = true;
    }

    onChangeSelect(typeValue) {
        this.refModel.requireType = typeValue;
        switch (typeValue) {
            case "Commercial":
                this.refModel.comm_options = "";
                this.refModel.it_options = "";
                this.refModel.bhk = "";
                break;
            case "IT Park":
                this.refModel.it_options = "";
                this.refModel.comm_options = "";
                this.refModel.bhk = "";
                break;
            case "Residential":
                this.refModel.bhk = "";
                this.refModel.it_options = "";
                this.refModel.comm_options = "";
                break;
        }
    }
    dataBindForPdf = (leadInfo) => {
        this.refModel['PriorityNo'] = this.refModel.Priority;
        this.refModel['CreatedOn'] = new Date().toLocaleDateString();
        this.refModel['FirstName'] = this.refModel.refFirst;
        this.refModel['AddressLine1'] = this.refModel.refAddress1;
        this.refModel['City'] = this.refModel.refCity;
        this.refModel['State'] = this.refModel.refState;
        this.refModel['PinCode'] = this.refModel.PinCode;
        this.refModel['Occupation'] = this.refModel.refOccupation;
        this.refModel['MobileNo'] = this.refModel.refMobileNo;
        this.refModel['ReferralEmail'] = this.refModel.refEmail;
        this.refModel['PanNo'] = this.refModel.RefPanNo;
        this.refModel['AdharCard'] = this.refModel.AdharNo;
        this.refModel['TokenAmount_Bankname'] = this.refModel.TokenBankName;
        this.refModel['TokenAmount_ChequeNo'] = this.refModel.TokenChequeNo;
        this.refModel['Token_Amount'] = this.refModel.TokenAmount;
        this.refModel['Token_ChequeDate'] = this.refModel.TokenChequeDate;
        this.refModel['Source'] = leadInfo.Source === 'Channel Partner' ? 'Channel Partner Referral' : leadInfo.Source;
        this.refModel['ReferredBy'] = this.refModel['refByName'] ? this.refModel['refByName']['name'] : '';
        this.refModel['ReferredByName'] = this.refModel['refByName'] ? this.refModel['refByName']['code'] : '';
        this.refModel['Referral1_Name'] = this.refModel.rName1;
        this.refModel['Referral1_ContactNo'] = this.refModel.rMobile1;
        this.refModel['Referral2_Name'] = this.refModel.rName2;
        this.refModel['Referral2_ContactNo'] = this.refModel.rMobile2;
        this.refModel['BeneficiaryName'] = this.refModel.bName;
        this.refModel['BankName'] = this.refModel.BankName;
        this.refModel['Branch'] = this.refModel.Branch;
        this.refModel['AccountNo'] = this.refModel.AccountNo;
        this.refModel['IFSCCode'] = this.refModel.IFSC;
        this.refModel['AcType'] = this.refModel.AccountType;
        this.refModel['Budget'] = this.refModel.budget ? this.refModel.budget : '';
    }
    //******* Submit EOI form Details *******//
    submitEOIForm = (leadInfo, referralGenerationForm) => {
        this.dataBindForPdf(leadInfo);
        this.eoipdfService.printPdf(this.refModel, 'SendEmail').then((response) => {
            if (response) {
                let file = response[0] ? response : [];
                leadInfo.Source = leadInfo.Source === 'Channel Partner' ? 'Channel Partner Referral' : leadInfo.Source;
                if (leadInfo.Source === 'Channel Partner Referral' || leadInfo.Source === 'CRO') {
                    leadInfo.refByName = leadInfo['refByName']['code'];
                }
                this.submitEOISubscription = this.leadGenerationService.InsertEOIFormDetails(leadInfo, this.loggedInuserDetails, file).subscribe((response) => {
                    if (response && response['successful'] && response['data'][0]) {
                        response['data'][0].TokenAmount = leadInfo.Token_Amount;
                        if (this.refModel['PaymentType'] === 'Tru Pay') {
                            this.sendTrupaylink(response['data'][0]);
                        } else {
                            this.insertInVirtualWallet(response['data'][0]);
                        }
                        referralGenerationForm.form.markAsPristine();
                        referralGenerationForm.form.markAsUntouched();
                        this.onClearScreen();
                        this.details = {};
                    } else {
                        this.showFailedBar('Failed to submit form');
                    }
                });
            }
        });
    }

    //******* Insert into Virtual Wallet *******//
    insertInVirtualWallet = (leadDetails) => {
        leadDetails.TransactionType = 'EOICheque';
        this.insertInVirtualWalletSubscription = this.leadGenerationService.insertInVirtualWallet(this.loggedInuserDetails, leadDetails, 'Insert').subscribe(response => {
            if (response && response['successful']) {
                this.showSuccessBar('EOI Submitted Successfully. Token Amount added to Virtual Wallet');
            } else {
                this.showFailedBar('EOI Submitted Successfully. Failed To add Token Amount');
            }
        })
    }

    OnSubmitBtnClick = (leadInfo, referralGenerationForm) => {
        if ((this.loggedInuserDetails.Role === 3 || this.loggedInuserDetails.Role === 7) && this.disableFields === true && this.updateReferral === false) {
            this.submitEOIForm(leadInfo, referralGenerationForm);
        }
        if ((this.loggedInuserDetails.Role === 3 || this.loggedInuserDetails.Role === 7) && this.disableFields === true && this.updateReferral === true) {
            this.updateReferralDetail(leadInfo, referralGenerationForm);
        }
        if ((this.loggedInuserDetails.Role === 1 || this.loggedInuserDetails.Role === 7 || this.loggedInuserDetails.Role === 3 ) && this.disableFields === false) {
            this.isSpinnerActive = true;
            this.refModel.preTime = this.selectedTime;
            leadInfo.Source = leadInfo.Source === 'Channel Partner' ? 'Channel Partner Referral' : leadInfo.Source;
            if (leadInfo.Source === 'Channel Partner Referral' || leadInfo.Source === 'CRO') {
                leadInfo.refByName = leadInfo['refByName']['code'];
            }
            this.submitBtnSubscription = this.leadGenerationService.InsertReferralGenerationDetails(leadInfo, this.loggedInuserDetails).subscribe((response) => {
                if (response && response['successful']) {
                    this.onClearScreen();
                    this.showSuccessBar("Lead Generated Successfully.");
                    this.details = {};
                    this.showme = true;
                    //******* get Project Id for sv insert for razer pay *******//
                    if (response['data'][0]) {
                        let referraldetails = response['data'][0];
                        referraldetails['PreferredProjectId'] = this.PreferredProjectInfo.filter(x => x['ProjectName'] && x['ProjectName'] === leadInfo.PreferredProject)[0]['ProjectId'];
                        this.virtualSiteVisitForCp(referraldetails);
                    }
                    //  ***** End ***** //
                } else {
                    this.showFailedBar("Lead Generation Failed.");
                }
                this.isSpinnerActive = false;
            });
        }
        this.isEdit = false;
    }
    //********* TrU Pay Link Send *********/
    sendTrupaylink = (leaddata) => {
        leaddata.Description = leaddata.ProjectVisited;
        leaddata.Currency = 'INR';
        this.paymentlinkForEOISubscription = this.leadGenerationService.paymentlinkForEOI(this.loggedInuserDetails, leaddata).subscribe(response => {
            if (response && response['successful'] && response['data'][0] && response['data'][0]['message']) {
                this.showSuccessBar('EOI Submitted Successfully.TRU pay link send on registered Mobile number and email');
            } else {
                this.showFailedBar('EOI Submitted Successfully.TRU Pay link creation Failed');
            }
        })
    }

    // ******** Update Referral Details and Eoi Details ********** //
    updateReferralDetail = (leadInfo, referralGenerationForm) => {
        this.dataBindForPdf(leadInfo);
        this.eoipdfService.printPdf(this.refModel, 'SendEmail').then((response) => {
            if (response) {
                let file = response[0] ? response : [];
                leadInfo.Source = leadInfo.Source === 'Channel Partner' ? 'Channel Partner Referral' : leadInfo.Source;
                if (leadInfo.Source === 'Channel Partner Referral' || leadInfo.Source === 'CRO') {
                    leadInfo.refByName = leadInfo['refByName']['code'];
                }
                this.leadGenerationService.updateReferralGenerationDetails(leadInfo, this.loggedInuserDetails, file).subscribe(response => {
                    if (response && response['successful']) {
                        this.snackBar.open('EOI Updated Successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] });
                        this.onClearScreen();
                        referralGenerationForm.form.markAsPristine();
                        referralGenerationForm.form.markAsUntouched();
                    }
                    else
                        this.snackBar.open('Failed to update', null, { duration: 5000, panelClass: ['red-snackbar'] });
                });
            }
        });
    }
    // if lead referred by is Cp then insert into virtual balance 
    virtualSiteVisitForCp = (referraldetails) => {
        this.leadGenerationService.siteVisitInsert(this.loggedInuserDetails, referraldetails).subscribe((response) => {
        });
    }
    GetPreferedAreaByCity = (PreferredCityName) => {
        if (PreferredCityName) {
            this.preferedAreaSubscription = this.leadGenerationService.GetPreferredLocationOnCity(this.loggedInuserDetails, PreferredCityName).subscribe((response) => {
                if (response && response["data"]) {
                    this.PreferredAreaInfo = response["data"];
                }
            });
        }
    }
    GetPreferedProjectByArea = (PreferredAreaName) => {
        if (PreferredAreaName) {
            this.preferredProjectAreaSubscription = this.leadGenerationService.GetProjectListOnSelectedLocation(this.loggedInuserDetails, PreferredAreaName).subscribe((response) => {
                if (response && response["data"]) {
                    this.PreferredProjectInfo = response["data"];
                }
            });
        }
    }
    changeVisitSite = (visitSiteSelection) => {
        if (visitSiteSelection) {
            this.refModel.visitSite = visitSiteSelection;
            this.showGroup = visitSiteSelection === "yes" ? true : false;
        }
    }
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }
    // For Allow past 3 Date Only 
    getlastthreeDay = () => {
        let d = new Date();
        d.setDate(d.getDate() - 3).toLocaleString();
        return d.toISOString().split('T')[0]
    }
//when country code is not 91//
    valid = (mobile) => {
          if (mobile)
            this.mobileValidationSubscriptions = this.leadGenerationService.getMobileValidation(mobile).subscribe((response) => {
              if (response && response["data"]) {
                this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
                this.showmobile = response["data"][0].IsAvailable;
              }
              else {
                this.showmobile = "";
              }
            });
        }

// when country code is not 91//
show = (data) => {
    this.showme = data !== '91' ?  false :  true;
    this.refModel.refMobileNo=null;
  }

    getMobileValidation = (mobile) => {
        var mobilepattern: any = /^\d{10}$/;
        if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
            this.mobileValidationSubscription = this.leadGenerationService.getMobileValidation(mobile).subscribe((response) => {
                if (response && response["data"]) {
                    this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
                    this.showmobile = response["data"][0].IsAvailable;
                    this.isshow = true;
                }
            });
        } else {
            this.showmobile = "";
        }
    }
    getEmailValidation = (email) => {
        var emailpattern: any = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
        if (email && emailpattern.test(String(email).toLowerCase())) {
            this.emailValidationSubscription = this.leadGenerationService.getEmailValidation(email).subscribe((response) => {
                if (response && response["data"]) {
                    this.isEmailAvailable = (response["data"][0].IsAvailable === 'Available');
                    this.showemail = response["data"][0].IsAvailable;
                }
            });
        } else {
            this.showemail = "";
        }
    }

    // ******* Front Desk Login Mobile number Duplicate Users ******** //
    getUserDetailsOnMobile = (mobileNo) => {
        if (mobileNo && mobileNo.trim() !== "") {
            this.getUserDetailsOnMobileSubscription = this.leadGenerationService.userOnMobile(this.loggedInuserDetails, mobileNo).subscribe((response) => {
                if (response && response['data'][0].length > 0) {
                    this.leadDetails = response['data'][0];
                    this.disableSubmitBtn = this.leadDetails.length > 0 ? false : true;
                    this.userSelectionModal.show();
                    this.updateReferral = true;
                } else { this.disableSubmitBtn = true; }
            });
        }
    }
    // ******** Pop UP open on Selected User ******* //
    selectedId = (details) => {
        this.referralInfoDisplay(details);
        this.refModel['ReferralId'] = details.LeadId;
        this.userSelectionModal.hide();
    }
    // ****** Hide Pop up Modal ****** //
    cancel = () => {
        this.userSelectionModal.hide();
        this.refModel.refMobileNo = '';
    }

    onClearScreen = () => {
        //-------Clear the screen Model-------//
        this.refModel = <IrefModel>{};
        this.refModel.preCity = "Pune";
        this.refModel.requireType = "Residential";
        this.refModel.refCity = "Pune";
        this.refModel.refCountryCode = null;
        this.showmobile = "";
        this.showemail = "";
        this.refModel.refMobileNo = "";
        this.refModel.PaymentType = "";
        this.msg = "";
        this.enableSource = false;
        this.disableSubmitBtn = false;
        this.updateReferral = false;
        this.disableFields = false;
        this.disabledPriority = false;
        //-------End-------//
    }
    openClock = () => {
        //-------open Time Click-------//
        const amazingTimePicker = this.atp.open({});
        amazingTimePicker.afterClose().subscribe(time => {
            this.selectedTime = time;
        });
        //-------End-------//
    }
    typeChanges = () => {
        this.refModel['PaymentType'] === 'Tru Pay' ? this.refModel['TokenBankName'] = 'Tru Pay' : null;
    }
    ngOnDestroy() {
        this.onScreenLoadGetDataSubscription ? this.onScreenLoadGetDataSubscription.unsubscribe() : null;
        this.emailValidationSubscription ? this.emailValidationSubscription.unsubscribe() : null;
        this.mobileValidationSubscription ? this.mobileValidationSubscription.unsubscribe() : null;
        this.mobileValidationSubscriptions ? this.mobileValidationSubscriptions.unsubscribe() : null;
        this.preferredProjectAreaSubscription ? this.preferredProjectAreaSubscription.unsubscribe() : null;
        this.preferedAreaSubscription ? this.preferedAreaSubscription.unsubscribe() : null;
        this.submitBtnSubscription ? this.submitBtnSubscription.unsubscribe() : null;
        this.submitEOISubscription ? this.submitEOISubscription.unsubscribe() : null;
        this.prirityNoSubscription ? this.prirityNoSubscription.unsubscribe() : null;
        this.getUserDetailsOnMobileSubscription ? this.getUserDetailsOnMobileSubscription.unsubscribe() : null;
        this.paymentlinkForEOISubscription ? this.paymentlinkForEOISubscription.unsubscribe() : null;
        this.insertInVirtualWalletSubscription ? this.insertInVirtualWalletSubscription.unsubscribe() : null;
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    //------- success snabar method -------//
    showSuccessBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
    }
    //------- failed snakbar method -------//
    showFailedBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
    }
}