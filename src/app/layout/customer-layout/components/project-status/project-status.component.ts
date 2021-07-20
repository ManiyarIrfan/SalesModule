import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { ProjectStatusService } from 'src/app/shared/services/customer/project-status.service';
import { ProjectDetailsService } from 'src/app/shared/services/channelPartner/project-details.service';
import { routerTransition } from 'src/app/router.animations';
import { IproModel, IplanFlat, IlistofbuildType, IchannelpartnerSearchModel, IpreferredLocationLists, IpreferredProjectLists, IpreferredBHKLists } from 'src/app/shared/models/Customer/project-status.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-project-status',
    templateUrl: './project-status.component.html',
    styleUrls: ['./project-status.component.scss'],
    animations: [routerTransition()]
})
export class ProjectStatusComponent implements OnInit {
    public showDataNotFoundMessage: boolean = true;
    public showSuccessfullMessage: string = "";
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{}
    public isSpinnerActive: boolean = true;
    public proModel: IproModel = <IproModel>{};
    public planFlat: IplanFlat = <IplanFlat>{};
    public projectDetails: IplanFlat = <IplanFlat>{};
    public isEdit: boolean = false;
    public isShow: boolean;
    public showBuildingNotFoundMessage: boolean;
    public reportIssueModel: string[] = [];
    public listofbuildType: IlistofbuildType = <IlistofbuildType>{};
    public p1: number;
    public showProjectNotFoundMessage: boolean = true;
    public listedProjects: string[] = [];
    public channelpartnerSearchModel: IchannelpartnerSearchModel = <IchannelpartnerSearchModel>{};
    public preferredLocationLists: IpreferredLocationLists= <IpreferredLocationLists>{};
    public preferredProjectLists: IpreferredProjectLists= <IpreferredProjectLists>{};
    public preferredBHKLists: IpreferredBHKLists = <IpreferredBHKLists>{};
    public slides: string[] = [];

    public GetProjectListOnSelectedLocationSubscription:Subscription;
    public GetBHKDetailsOnSelectedProjectSubscription:Subscription;
    public GetSerarchedProjectDetailsSubscription:Subscription;
    public GetFlatDetailsSubscription:Subscription;
    public GetProjectStatusDetailsSubscription:Subscription;
    public GetPreferredLocationSubscription:Subscription;

    @ViewChild('showBuildingModal', { static: false }) public showBuildingModal: ModalDirective;

    constructor(public router: Router,
        private projectStatusService: ProjectStatusService,
        private projectDetailsService: ProjectDetailsService,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            switch (this.loggedInuserDetails.UserType.toLowerCase()) {
                case 'customer':
                    this.isShow = true;
                this.GetProjectStatusDetailsSubscription= this.projectStatusService.GetProjectStatusDetails(this.loggedInuserDetails).subscribe((response) => {
                        if (response && response["data"]) {
                            if (response['exception']) {
                                this.showDataNotFoundMessage = true;
                                this.showSuccessBar = response['exception'];
                            } else {
                                this.showDataNotFoundMessage = false;
                            }
                            this.BindProjectStatusModule(response["data"]);
                            this.slides = response["data"][0] ? (response["data"][0][0] ? (response["data"][0][0]['ImageUrl'] ? response["data"][0][0]['ImageUrl'].split(",") : []) : []) : [];
                            this.proModel['custType'] = "customer";
                        }
                        this.isSpinnerActive = false;
                    });
                    break;
                case 'referral':
                    this.isShow = false;
                    this.GetPreferredLocationSubscription=this.projectDetailsService.GetPreferredLocation(this.loggedInuserDetails).subscribe((response) => {
                        if (response && response["data"]) {
                            this.preferredLocationLists = response["data"][0];
                            if (this.preferredLocationLists && this.preferredLocationLists[0]) {
                                this.channelpartnerSearchModel.preferredLocation = "";
                            }
                            this.isSpinnerActive = false;
                        }
                    });
                    break;
            }
        }
    }
    GetSelectedProjectsListOnLocation = () => {
        if (this.loggedInuserDetails) {
            this.GetProjectListOnSelectedLocationSubscription=this.projectDetailsService.GetProjectListOnSelectedLocation(this.loggedInuserDetails, this.channelpartnerSearchModel.preferredLocation).subscribe((response) => {
                if (response && response["data"]) {
                    this.preferredProjectLists = response["data"];
                    if (this.preferredProjectLists && this.preferredProjectLists[0]) {
                        this.channelpartnerSearchModel.preferredProjects = this.preferredProjectLists[0].ProjectName;
                        this.GetBHKDetailsOnProject();
                    }
                }
            });
        }
    }
    GetBHKDetailsOnProject = () => {
        if (this.loggedInuserDetails) {
            this.GetBHKDetailsOnSelectedProjectSubscription=this.projectDetailsService.GetBHKDetailsOnSelectedProject(this.loggedInuserDetails, this.channelpartnerSearchModel.preferredProjects).subscribe((response) => {
                if (response && response["data"]) {
                    this.preferredBHKLists = response["data"][0];
                    if (this.preferredBHKLists && this.preferredBHKLists[0])
                        this.channelpartnerSearchModel.preferredBHK = this.preferredBHKLists[0].BHK;
                }
            });
        }
    }
    onBHKChange(bhkValue) {
        this.channelpartnerSearchModel.preferredBHK = bhkValue;
    }
    OnSerchBtnClick = () => {
        if (this.loggedInuserDetails) {
         this.GetSerarchedProjectDetailsSubscription  = this.projectDetailsService.GetSerarchedProjectDetails(this.loggedInuserDetails, this.channelpartnerSearchModel).subscribe((response) => {
                if (response && response['data'][0] && response['data'][0].length > 0) {
                    this.listedProjects = response['data'][0];
                    this.showProjectNotFoundMessage = true;
                } else {
                    this.showProjectNotFoundMessage = false;
                }
            });
        }
    }
    buildingshow = (leadDetails) => {
        this.showBuildingModal.show();
        this.OnbuildingType(leadDetails);
    }
    OnbuildingType = (leadDetails) => {
        this.reportIssueModel = leadDetails;
        if (this.loggedInuserDetails) {
            this.GetFlatDetailsSubscription=this.projectDetailsService.GetFlatDetails(this.loggedInuserDetails, this.reportIssueModel, this.channelpartnerSearchModel).subscribe((response) => {
                if (response && response["data"][0] && response["data"][0].length > 0) {
                    this.listofbuildType = response["data"][0];
                    this.slides = response["data"][1];
                    this.showBuildingNotFoundMessage = true;
                } else {
                    this.showBuildingModal.show();
                    this.showBuildingNotFoundMessage = false;
                }
            });
        }
    }
    BindProjectStatusModule = (projectStatus: any): any => {
        if (projectStatus && projectStatus[0][0]) {
            this.proModel.proName = projectStatus[0][0].ProjectName + '(' + projectStatus[0][0].BuildingType + ')';
            this.proModel['project'] = projectStatus[0][0].ProjectName ? projectStatus[0][0].ProjectName : 'Project';
            this.proModel.currStatus = projectStatus[0][0].CurrentStatus;
            this.proModel.estiDate = projectStatus[0][0].EstimationCompletionDate;
            this.proModel.planFlat = projectStatus[0][0].PlannedActivity.split(",").join("\n");
            this.proModel.currPrice = projectStatus[0][0].CurrentPrice;
            this.projectDetails = projectStatus[0].slice(1);
        }
    }
    @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
        if (event.keyCode === 27) {
            this.showBuildingModal.hide();
        }
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    //------- success snabar method -------//
    showSuccessBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
    }

    ngOnDestroy()
    {
       this.GetProjectListOnSelectedLocationSubscription ? this.GetProjectListOnSelectedLocationSubscription.unsubscribe():null;
       this.GetBHKDetailsOnSelectedProjectSubscription ? this.GetBHKDetailsOnSelectedProjectSubscription.unsubscribe():null;
       this.GetSerarchedProjectDetailsSubscription ? this.GetSerarchedProjectDetailsSubscription.unsubscribe():null;
       this.GetFlatDetailsSubscription ? this.GetFlatDetailsSubscription.unsubscribe():null;
       this.GetProjectStatusDetailsSubscription ? this.GetProjectStatusDetailsSubscription.unsubscribe():null;
       this.GetPreferredLocationSubscription ? this.GetPreferredLocationSubscription.unsubscribe():null;
       
    }

}