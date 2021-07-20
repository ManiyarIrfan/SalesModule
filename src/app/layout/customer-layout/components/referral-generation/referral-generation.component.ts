import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ReferralGenerationService } from 'src/app/shared/services/customer/referral-generation.service';
import { routerTransition } from 'src/app/router.animations';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IrefModel } from 'src/app/shared/models/Customer/referal-generation.model';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-referral-generation',
    templateUrl: './referral-generation.component.html',
    styleUrls: ['./referral-generation.component.scss'],
    // animations: [routerTransition()]
})
export class ReferralGenerationComponent implements OnInit {

    public PreferredAreaInfo: object[] = [];
    public PreferredProjectInfo: object[] = [];
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public isSpinnerActive: boolean = false;
    public showGroup: boolean = false;
    public refModel: IrefModel = <IrefModel>{};
    public isEdit: boolean = false;
    public isMobileAvailable: boolean;
    public showmobile: string;
    public isshow: boolean;
    public isEmailAvailable: boolean;
    public showemail: string;
    public selectedTime: string;


    public GetPreferredLocationOnCitySubscription: Subscription;
    public GetProjectListOnSelectedLocationSubscription: Subscription;
    public InsertReferralGenerationDetailsSubscription: Subscription;
    public getMobileValidationSubscription: Subscription;
    public getEmailValidationSubscription: Subscription;


    public OccupationInfo: any = [
        { key: "Service", value: "Service" },
        { key: "Business", value: "Business" },
        { key: "Retirement", value: "Retirement" },
        { key: "Consultant", value: "Consultant" },
        { key: "House-wife", value: "House-wife" }];
    public RelationshipInfo: any = [
        { key: "Father", value: "Father" },
        { key: "Mother", value: "Mother" },
        { key: "Brother", value: "Brother" },
        { key: "Sister", value: "Sister" },
        { key: "Husband", value: "Husband" },
        { key: "Wife", value: "Wife" },
        { key: "Friend", value: "Friend" }];
    public RequirementInfo: any = [
        { key: "Residential", value: "Residential" },
        { key: "Commercial", value: "Commercial" },
        { key: "IT Park", value: "IT Park" },];
    public BhkInfo: any = [
        { key: "1 BHK", value: "1 BHK" },
        { key: "2 BHK", value: "2 BHK" },
        { key: "2.5 BHK", value: "2.5 BHK" },
        { key: "3 BHK", value: "3 BHK" },
        { key: "3.5 BHK", value: "3.5 BHK" },
        { key: "4 BHK", value: "4 BHK" },
        { key: "4.5 BHK", value: "4.5 BHK" },
        { key: "5 BHK", value: "5 BHK" },
        { key: "Bunglow plots", value: "Bunglow plots" },
        { key: "Plots", value: "Plots" },
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
        { key: "Retail Mall", value: "Retail Mall" },];
    public IT_ParkInfo: any = [
        { key: "IT Park", value: "IT Park" },
        { key: "SEZ", value: "SEZ" },
        { key: "Business Park", value: "Business Park" },];
    public BudgetInfo: any = [
        { key: "0 to 25", value: "0 to 25" },
        { key: "25 to 35", value: "25 to 35" },
        { key: "35 to 45", value: "35 to 45" },
        { key: "45 to 55", value: "55 to 65" },
        { key: "65 to 75", value: "75 to 85" },
        { key: "85 to 95", value: "85 to 95" },
        { key: "95 to More than 100", value: "95 to More than 100" },];
    public preferredCityInfo: any = [
        { key: "Pune", value: "Pune" },
        { key: "Mumbai", value: "Mumbai" },
        { key: "Nashik", value: "Nashik" }];

    constructor(public router: Router, private referralGenerationService: ReferralGenerationService, private atpCustomer: AmazingTimePickerService, private snackBar: MatSnackBar) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.refModel.custType = "ChannelPartner";
            }
        } else {
            this.router.navigate(['/login']);
        }
        this.refModel.refOccupation = "";
        this.refModel.requireType = "";
        this.refModel['budget'] = "";
        this.refModel.preCity = "";
        this.refModel.PreferredArea = "";
        this.refModel.PreferredProject = "";
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
            default:
                break;
        }
    }
    GetPreferedAreaByCity = (PreferredCityName) => {
        if (PreferredCityName) {
            this.GetPreferredLocationOnCitySubscription = this.referralGenerationService.GetPreferredLocationOnCity(this.loggedInuserDetails, PreferredCityName).subscribe((response) => {
                if (response["data"]) {
                    this.PreferredAreaInfo = response["data"];
                    this.refModel.PreferredArea = "";
                    this.refModel.PreferredProject = "";
                }
            });
        }
    }
    GetPreferedProjectByArea = (PreferredAreaName) => {
        if (PreferredAreaName) {
            this.GetProjectListOnSelectedLocationSubscription = this.referralGenerationService.GetProjectListOnSelectedLocation(this.loggedInuserDetails, PreferredAreaName).subscribe((response) => {
                if (response["data"]) {
                    this.PreferredProjectInfo = response["data"];
                    this.refModel.PreferredProject = "";
                }
            });
        }
    }
    onInserteBtnClick = (refModel, referralGenerationForm) => {
        this.isSpinnerActive = true;
        this.refModel['preTime'] = this.selectedTime;
        this.InsertReferralGenerationDetailsSubscription = this.referralGenerationService.InsertReferralGenerationDetails(this.refModel, this.loggedInuserDetails).subscribe((response) => {
            if (response['successful']) {
                this.isSpinnerActive = false;
                this.showSuccessBar("Lead Generated Successfully.");
            } else {
                this.isSpinnerActive = false;
                this.showFailedBar("Lead Generation Failed.");
            }
            this.refModel = <IrefModel>{};
            referralGenerationForm.form.markAsPristine();
            referralGenerationForm.form.markAsUntouched();
            this.OnCloseBtnClick(referralGenerationForm);
            this.isSpinnerActive = false;
        });
        this.isEdit = false;
    }
    OnCloseBtnClick = (referralGenerationForm) => {
        this.showmobile = "";
        this.showemail = "";
        this.refModel.refOccupation = "";
        this.refModel.requireType = "";
        this.refModel.bhk = "";
        this.refModel.comm_options = "";
        this.refModel.it_options = "";
        this.refModel.budget = "";
        this.refModel.preCity = "";
        this.refModel.PreferredArea = "";
        this.refModel.PreferredProject = "";
    }
    changeVisitSite = (visitSiteSelection) => {
        if (visitSiteSelection) {
            this.refModel['visitSite'] = visitSiteSelection;
            if (visitSiteSelection === "yes")
                this.showGroup = true;
            else
                this.showGroup = false;
        }
    }
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }
    getMobileValidation = (mobile) => {
        var mobilepattern: any = /^\d{10}$/;
        if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
            this.getMobileValidationSubscription = this.referralGenerationService.getMobileValidation(mobile).subscribe((response) => {
                if (response && response["data"][0]) {
                    this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
                    this.showmobile = response["data"][0].IsAvailable + (this.isMobileAvailable ? '' : '.\n Please Contact on Support Email / Number');
                    this.isshow = true;
                }
            });
        }
        else {
            this.showmobile = "";
        }
    }
    getEmailValidation = (email) => {
        var emailpattern: any = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
        if (email && emailpattern.test(String(email).toLowerCase())) {
            this.getEmailValidationSubscription = this.referralGenerationService.getEmailValidation(email).subscribe((response) => {
                if (response && response["data"][0]) {
                    this.isEmailAvailable = (response["data"][0].IsAvailable === 'Available');
                    this.showemail = response["data"][0].IsAvailable;
                }
            });
        }
        else {
            this.showemail = "";
        }
    }
    Clock = () => {
        //-------open Time Click-------//
        const amazingTimePicker = this.atpCustomer.open({});
        amazingTimePicker.afterClose().subscribe(time => {
            this.selectedTime = time;
        });
        //-------End-------//
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
    ngOnDestroy() {
        this.GetPreferredLocationOnCitySubscription ? this.GetPreferredLocationOnCitySubscription.unsubscribe() : null;
        this.GetProjectListOnSelectedLocationSubscription ? this.GetProjectListOnSelectedLocationSubscription.unsubscribe() : null;
        this.InsertReferralGenerationDetailsSubscription ? this.InsertReferralGenerationDetailsSubscription.unsubscribe() : null;
        this.getMobileValidationSubscription ? this.getMobileValidationSubscription.unsubscribe() : null;
        this.getEmailValidationSubscription ? this.getEmailValidationSubscription.unsubscribe() : null;
    }

}