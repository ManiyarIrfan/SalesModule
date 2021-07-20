import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Router } from '@angular/router';
import { ReferralGenerationService } from 'src/app/shared/services/customer/referral-generation.service';
import { routerTransition } from 'src/app/router.animations';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { IrefModel } from 'src/app/shared/models/channelpartner/referral-generation.model'
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
    selector: 'app-referral-generation',
    templateUrl: './referral-generation.component.html',
    styleUrls: ['./referral-generation.component.scss'],
    animations: [routerTransition()]
})
export class ReferralGenerationComponent implements OnInit, OnDestroy {
    public isEdit: boolean = false;
    public isMobileAvailable: boolean;
    public showmobile: string;
    public isEmailAvailable: boolean;
    public showemail: string;
    public PreferredAreaInfo: object[] = [];
    public PreferredProjectInfo: object[] = [];
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public emailpattern: any = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    public isSpinnerActive: boolean = false;
    public showGroup: boolean = false;
    public refModel: IrefModel = <IrefModel>{};
    public selectedTime: string;
    private _EventSubscription: Array<Subscription> = [];
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
        { key: "Retail Mall", value: "Retail Mall" }];
    public IT_ParkInfo: any = [
        { key: "IT Park", value: "IT Park" },
        { key: "SEZ", value: "SEZ" },
        { key: "Business Park", value: "Business Park" }];
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

    constructor(public router: Router, private referralGenerationService: ReferralGenerationService, private atpChannelPartner: AmazingTimePickerService,
        private snackBar: MatSnackBar) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.refModel['custType'] = "ChannelPartner";
            }
        } else {
            this.router.navigate(['/login']);
        }
        this.refModel['refOccupation'] = "";
        this.refModel['requireType'] = "";
        this.refModel['bhk'] = "";
        this.refModel['comm_options'] = "";
        this.refModel['it_options'] = "";
        this.refModel.budget = "";
        this.refModel.preCity = "";
        this.refModel.PreferredArea = "";
        this.refModel.PreferredProject = "";
    }
    onChangeSelect(typeValue) {
        this.refModel.requireType = typeValue;
        switch (typeValue) {
            case "Commercial":
                this.refModel.comm_options = this.CommercialInfo[0].value;
                this.refModel.it_options = " ";
                this.refModel.bhk = " ";
                break;
            case "IT Park":
                this.refModel.it_options = this.IT_ParkInfo[0].value;
                this.refModel.comm_options = " ";
                this.refModel.bhk = " ";
                break;
            case "Residential":
                this.refModel.bhk = this.BhkInfo[0].value;
                this.refModel.it_options = " ";
                this.refModel.comm_options = " ";
                break;
        }
    }
    GetPreferedAreaByCity = (PreferredCityName) => {
        if (PreferredCityName) {
            const GetPreferedLocation = this.referralGenerationService.GetPreferredLocationOnCity(this.loggedInuserDetails, PreferredCityName).subscribe((response) => {
                if (response["data"]) {
                    this.PreferredAreaInfo = response["data"];
                    this.refModel.PreferredArea = "";
                    this.refModel.PreferredProject = "";
                }
                this._EventSubscription.push(GetPreferedLocation);
            });
        }
    }
    GetPreferedProjectByArea = (PreferredAreaName) => {
        if (PreferredAreaName) {
            const GetProjectList = this.referralGenerationService.GetProjectListOnSelectedLocation(this.loggedInuserDetails, PreferredAreaName).subscribe((response) => {
                if (response["data"]) {
                    this.PreferredProjectInfo = response["data"];
                    this.refModel.PreferredProject = "";
                }
                this._EventSubscription.push(GetProjectList);
            });
        }
    }
    OnInsertBtnClick = (refModel, referralGenerationForm) => {
        this.refModel['preTime'] = this.selectedTime;
        this.isSpinnerActive = true;
        const Insertreferral = this.referralGenerationService.InsertReferralGenerationDetails(this.refModel, this.loggedInuserDetails).subscribe((response) => {
            if (response['successful']) {
                this.snackBar.open('Lead Generated Successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] });
                this.OnCloseBtnClick(referralGenerationForm);
            } else {
                this.snackBar.open('Lead Generation Failed', null, { duration: 5000, panelClass: ['red-snackbar'] });
            }
            this.isSpinnerActive = false;
            this.selectedTime = ``;
            this.showemail = '';
            this.showmobile = "";
            this.isMobileAvailable = null;
            this.isEmailAvailable = null;
            this._EventSubscription.push(Insertreferral);
        });
        this.isEdit = false;
        this.showGroup = false;
    }
    changeVisitSite = (visitSiteSelection) => {
        if (visitSiteSelection) {
            this.refModel.visitSite = visitSiteSelection;
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
            const getMobilevalidation = this.referralGenerationService.getMobileValidation(mobile).subscribe((response) => {
                if (response && response["data"][0]) {
                    this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
                    this.showmobile = response["data"][0].IsAvailable + '. \n Please Contact on Support Email / Number';
                }
            });
            this._EventSubscription.push(getMobilevalidation);
        }
        else {
            this.showmobile = "";
        }
    }
    getEmailValidation = (email) => {
        var emailpattern: any = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
        if (email && emailpattern.test(String(email).toLowerCase())) {
            const GetEmailValidation = this.referralGenerationService.getEmailValidation(email).subscribe((response) => {
                if (response && response["data"][0]) {
                    this.isEmailAvailable = (response["data"][0].IsAvailable === 'Available');
                    this.showemail = response["data"][0].IsAvailable;
                }
            });
            this._EventSubscription.push(GetEmailValidation);
        }
        else {
            this.showemail = "";
        }
    }
    OnCloseBtnClick = (referralGenerationForm) => {
        this.refModel = <IrefModel>{};
        this.showmobile = "";
        this.showemail = "";
        this.refModel['refOccupation'] = "";
        this.refModel.requireType = "";
        this.refModel.bhk = "";
        this.refModel.comm_options = "";
        this.refModel.it_options = "";
        this.refModel.budget = "";
        this.refModel.preCity = "";
        this.refModel.PreferredArea = "";
        this.refModel.PreferredProject = "";
    }
    openClock = () => {
        //-------open Time Click-------//
        const amazingTimePicker = this.atpChannelPartner.open({});
        amazingTimePicker.afterClose().subscribe(time => {
            this.selectedTime = time;
        });
        //-------End-------//
    }
    ngOnDestroy() {
        for (let item of this._EventSubscription) {
            item.unsubscribe();
        }
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }

}
