import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectDetailsService } from 'src/app/shared/services/channelPartner/project-details.service';
import { routerTransition } from 'src/app/router.animations';
import { IfilterDataModel, IbuildingDetailModel, IlistofbuildType, IlistedProjects, IchannelpartnerSearchModel, IpreferredLocationLists, IpreferredProjectLists, IpreferredBHKLists, IbuildingDetailCountModel, IselectedBrochureNames, IprojectInfo } from 'src/app/shared/models/channelpartner/project-status.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-project-status',
    templateUrl: './project-status.component.html',
    styleUrls: ['./project-status.component.scss'],
    animations: [routerTransition()]
})
export class ProjectStatusComponent implements OnInit {
    public storeTennt: number;
    public filterDataModel: IfilterDataModel = <IfilterDataModel>{}
    public slides: string[] = [];
    public showBuildingNotFoundMessage: boolean = true;
    public buildingDetailModel: IbuildingDetailModel = <IbuildingDetailModel>{};
    public listofbuildType: IlistofbuildType = <IlistofbuildType>{};
    public showProjectNotFoundMessage: boolean = true;
    public listedProjects: IlistedProjects[] = [];
    public listedProjectsDis: object[] = [];
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public channelpartnerSearchModel: IchannelpartnerSearchModel = <IchannelpartnerSearchModel>{};
    public preferredLocationLists: IpreferredLocationLists[] = [];
    public preferredProjectLists: IpreferredProjectLists = <IpreferredProjectLists>{};
    public preferredBHKLists: IpreferredBHKLists = <IpreferredBHKLists>{};
    public flatcount: object[] = [];
    public buildingDetailCountModel: IbuildingDetailCountModel = <IbuildingDetailCountModel>{};
    public selectedBrochureNames: IselectedBrochureNames = <IselectedBrochureNames>{};
    public Brochure: boolean = true;
    public p1: number;
    public isLoaded: boolean;
    // public page: any;
    public showPDFNotFoundMessage: boolean = true;
    public isLoadingBuildingPopup: boolean;
    public blockUnblockMsg: string;
    public projectInfo: IprojectInfo = <IprojectInfo>{};
    public hideConfimBtn: boolean = false;
    public btnHeader: string = '';
    public Result: string;
    public FlatNo: string;
    public BuildingType: string;
    public BHK: string;
    public Available: string;
    public Floor: string;
    public FlatView: string;
    public LayoutType: string;
    public ReraArea: string;
    public Counter: string;
    public FlatBlockByName: string;
    public isSpinnerActive: string;

    public GetPreferredLocationSubscription: Subscription;
    public GetProjectListOnSelectedLocationSubscription: Subscription;
    public GetBHKDetailsOnSelectedProjectSubscription: Subscription;
    public GetSerarchedProjectDetailsSubscription: Subscription;
    public GetFlatCounterDetailsSubscription: Subscription;
    public GetFlatDetailsSubscription: Subscription;
    public FlatBlockUnblockSubscription: Subscription;
    public GetBrochureNameListSubscription: Subscription;

    public ListOffilter = [
        { item: 'Result' },
        { item: 'FlatNo' },
        { item: 'BuildingType' },
        { item: 'Available' },
        { item: 'Floor' },
        { item: 'FlatView' },
        { item: 'LayoutType' },
        { item: 'ReraArea' },
        { item: 'Counter' },
        { item: 'FlatBlockByName' },
        { item: 'BHK' }];
    @ViewChild('showBuildingModal', { static: false }) public showBuildingModal: ModalDirective;
    @ViewChild('blockunblockFlatmodal', { static: false }) public blockunblockFlatmodal: ModalDirective;
    public showPdf = 'https://truimages.blob.core.windows.net/productionimages/Brochure/ProjectBrochure/';

    constructor(private projectDetailsService: ProjectDetailsService, private router: Router, private snackBar: MatSnackBar) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.GetPreferredLocationSubscription = this.projectDetailsService.GetPreferredLocation(this.loggedInuserDetails).subscribe((response) => {
                    if (response["data"]) {
                        this.preferredLocationLists = response["data"][0];
                        if (this.preferredLocationLists && this.preferredLocationLists[0]) {
                            this.GetSelectedProjectsListOnLocation();
                        }
                    }
                });
                this.flatcount = [];
            }
        } else {
            this.router.navigate(['/login']);
        }
    }
    GetSelectedProjectsListOnLocation = () => {
        this.GetProjectListOnSelectedLocationSubscription = this.projectDetailsService.GetProjectListOnSelectedLocation(this.loggedInuserDetails, this.channelpartnerSearchModel['preferredLocation']).subscribe((response) => {
            if (response["data"]) {
                this.preferredProjectLists = response["data"];
                if (this.preferredProjectLists && this.preferredProjectLists[0]) {
                    this.channelpartnerSearchModel['preferredProjects'] = this.preferredProjectLists[0].ProjectName;
                    this.GetBHKDetailsOnProject();
                }
            }
        });
    }
    FilterTableData = () => {
        let counter = 0;
        this.ListOffilter.forEach(element => {
            if (element && this.filterDataModel[element.item]) {
                let Dat = counter > 0 ? this.listedProjectsDis : this.listedProjects;
                this.listedProjectsDis = Dat.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
                counter++;
            }
        });
        this.listedProjectsDis = counter === 0 ? this.listedProjects : this.listedProjectsDis;
    }
    GetBHKDetailsOnProject = () => {
        this.GetBHKDetailsOnSelectedProjectSubscription = this.projectDetailsService.GetBHKDetailsOnSelectedProject(this.loggedInuserDetails, this.channelpartnerSearchModel['preferredProjects']).subscribe((response) => {
            if (response["data"]) {
                this.preferredBHKLists = response["data"][0];
                if (this.preferredBHKLists && this.preferredBHKLists[0])
                    this.channelpartnerSearchModel['preferredBHK'] = this.preferredBHKLists[0].BHK;
            }
        });
    }
    onChange(locationValue) {
        if (locationValue !== "")
            this.listedProjects = [];
        this.listedProjectsDis = [];
        this.storeTennt = (this.preferredLocationLists && this.preferredLocationLists.length > 0) ? this.preferredLocationLists.find(x => x['Location'] === locationValue).TenantId : null;
        this.GetSelectedProjectsListOnLocation();
    }
    onProjectChange(projectValue) {
        // if (projectValue !== "")
        this.GetBHKDetailsOnProject();
    }
    onBHKChange(bhkValue) {
        this.channelpartnerSearchModel['preferredBHK'] = bhkValue;
    }
    OnSerchBtnClick = () => {
        //-------Search the Project Details-------//
        this.channelpartnerSearchModel['TenantId'] = this.storeTennt ? this.storeTennt : null;
        this.GetSerarchedProjectDetailsSubscription = this.projectDetailsService.GetSerarchedProjectDetails(this.loggedInuserDetails, this.channelpartnerSearchModel).subscribe((response) => {
            if (response && response['data'][0] && response['data'][0].length > 0 || response['data'][0].length != 0) {
                this.listedProjects = response['data'][0];
                this.listedProjectsDis = response['data'][0];
                this.showProjectNotFoundMessage = true;
                this.GetAllBrochureName(this.channelpartnerSearchModel['preferredProjects']);
            } else {
                this.showProjectNotFoundMessage = false;
                this.showPDFNotFoundMessage = false;
            }
        });
        //-------End-------//
    }
    buildingshow = (buildingDetails) => {
        //-------After Click Building Show filter Already Click or not to show number of Views count-------//
        let list = this.flatcount.filter(x => x['flatno'] === buildingDetails.FlatNo);
        if (list.length <= 0) {
            this.OnbuildingTypecount(buildingDetails);
            this.flatcount.push({ flatno: buildingDetails.FlatNo, counter: 1 });
        }
        this.OnbuildingType(buildingDetails);
        this.showBuildingModal.show();
        //-------End-------//
    }
    OnbuildingTypecount = (buildingDetails) => {
        //-------Increase the Count-------//
        this.buildingDetailCountModel = buildingDetails;
        if (this.loggedInuserDetails) {
            this.GetFlatCounterDetailsSubscription = this.projectDetailsService.GetFlatCounterDetails(this.loggedInuserDetails, this.buildingDetailCountModel, this.channelpartnerSearchModel).subscribe((response) => {
                if (response && response["data"]) {
                }
            });
        }
        //-------End-------//
    }
    OnbuildingType = (buildingDetails) => {
        //-------Show Model Pop Up-------//
        this.buildingDetailModel = buildingDetails;
        this.isLoadingBuildingPopup = false;
        this.GetFlatDetailsSubscription = this.projectDetailsService.GetFlatDetails(this.loggedInuserDetails, this.buildingDetailModel, this.channelpartnerSearchModel).subscribe((response) => {
            if (response && response["data"] && response['data'][0].length > 0) {
                this.listofbuildType = response["data"][0];
                this.slides = response["data"][1];
                this.showBuildingNotFoundMessage = true;
            } else {
                this.showBuildingNotFoundMessage = false;
            }
            this.isLoadingBuildingPopup = true;
        });
        //-------End-------//
    }
    onClose = () => {
        //-------End Model Window-------//
        this.showBuildingModal.hide();
        this.blockunblockFlatmodal.hide();
        //-------End-------//
    }
    blockUnblock = (projectDetails) => {
        //-------Block and Unblock the flat-------//
        this.projectInfo = projectDetails;
        this.blockunblockFlatmodal.show();
        if (projectDetails.Available.toLocaleLowerCase() === 'no') {
            if (projectDetails.FlatBlockBy === this.loggedInuserDetails.UserId) {
                this.blockUnblockMsg = "Do you want to unblock flat?";
                this.hideConfimBtn = false;
            } else {
                this.blockUnblockMsg = "This flat is already Booked. You can not block.";
                this.hideConfimBtn = true;
            }
        } else {
            this.blockUnblockMsg = "This flat will be blocked for you for next 24 hours. Do you want to Proceed?";
            this.hideConfimBtn = false;
        }
        //-------End-------//
    }
    confirmBlock = () => {
        //------- on Confirm Click send block and unblock -------//
        this.projectInfo.Available = this.projectInfo.Available.toLocaleLowerCase() === 'no' ? 'Yes' : 'No';
        this.FlatBlockUnblockSubscription = this.projectDetailsService.FlatBlockUnblock(this.loggedInuserDetails, this.projectInfo).subscribe((response) => {
            if (response && response["successful"]) {
                this.showSuccessBar("Flat Details Successfully updated");
            } else {
                this.showFailedBar("Failed to update Flat Details");
            }
            this.blockunblockFlatmodal.hide();

        });
        //-------End-------//
    }
    GetAllBrochureName = (ProjectName) => {
        //-------Get All Brochure Names-------//
        this.GetBrochureNameListSubscription = this.projectDetailsService.GetBrochureNameList(this.loggedInuserDetails, ProjectName, this.Brochure).subscribe((response) => {
            if (response && response["data"] && response["data"].length > 0) {
                this.selectedBrochureNames = response["data"];
                this.showPDFNotFoundMessage = true;
            } else {
                this.showPDFNotFoundMessage = false;
            }
        });
        //-------End-------//
    }
    showFile = (pdfName) => {
        //-------To Show PDF-------//
        window.open(this.showPdf + pdfName);
        //-------End-------//
    }
    showSuccessBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
    }
    //------- failed snakbar method -------//
    showFailedBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
    }
    trackByFn(item) {
        return item.id; // or item.id
    }
    ngOnDestroy() {
        this.GetPreferredLocationSubscription ? this.GetPreferredLocationSubscription.unsubscribe() : null;
        this.GetProjectListOnSelectedLocationSubscription ? this.GetProjectListOnSelectedLocationSubscription.unsubscribe() : null;
        this.GetBHKDetailsOnSelectedProjectSubscription ? this.GetBHKDetailsOnSelectedProjectSubscription.unsubscribe() : null;
        this.GetSerarchedProjectDetailsSubscription ? this.GetSerarchedProjectDetailsSubscription.unsubscribe() : null;
        this.GetFlatDetailsSubscription ? this.GetFlatDetailsSubscription.unsubscribe() : null;
        this.FlatBlockUnblockSubscription ? this.FlatBlockUnblockSubscription.unsubscribe() : null;
        this.GetBrochureNameListSubscription ? this.GetBrochureNameListSubscription.unsubscribe() : null;
    }

}