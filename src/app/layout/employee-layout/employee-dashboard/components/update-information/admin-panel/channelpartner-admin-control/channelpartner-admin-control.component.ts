import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AdminPanelService } from 'src/app/shared/services/employee/admin-panel.service';
import { routerTransition } from 'src/app/router.animations';
import { MatSnackBar } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IselectedChannelPartnerNames, IcpAdminPanelModel, IfilterDataModel } from 'src/app/shared/models/employeeModel/adminPanel.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tru-channelpartner-admin-control',
  templateUrl: './channelpartner-admin-control.component.html',
  styleUrls: ['./channelpartner-admin-control.component.scss'],
  animations: [routerTransition()]
})
export class ChannelpartnerAdminControlComponent implements OnInit {
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public selectedChannelPartnerNames: IselectedChannelPartnerNames[] = [];
  public allusersDetails: string[] = [];
  public cpApprovalListNotFound: boolean = false;
  public images: string;
  public imageNotAvailable: string;
  public isShowImage: boolean;
  public imagesArray: string[];
  public seperateImage: string[] = [];
  public BrokerId: number;
  public isOn: boolean;
  public AllOrganisation: string[] = [];
  public allProjectNames: string[] = [];
  public collapsed: boolean = true;
  public cpAdminPanelModel: IcpAdminPanelModel = <IcpAdminPanelModel>{};
  public AllBroker: string[] = [];
  public showBrokerName: boolean = false;
  public showChannelPartnerInfo: boolean;
  public isLoading: boolean;
  public p1: number;
  public p2: number;
  public Listlength: number;
  public storePanDetails: string[] = [];
  public filterDataModel: IfilterDataModel = <IfilterDataModel>{};
  public storeData: string[] = [];
  public statusInfo: any = [
    { key: "Pending", value: "Pending" },
    { key: "Varified", value: "Varified" },
    { key: "Rejected", value: "Rejected" }];
  public ListOffilter = [
    { item: 'FullName' },
    { item: 'PanNo' },
    { item: 'PANType' },
    { item: 'PANVerificationStatus' },
    { item: 'AccType' }
  ]
  @ViewChild('ConfirmationModel', { static: false }) public ConfirmationModel: ModalDirective;
  @ViewChild('showImageModel', { static: false }) public showImageModel: ModalDirective;
  @ViewChild('PanConfirmationModel', { static: false }) public PanConfirmationModel: ModalDirective;

  public reportSubscription: Array<Subscription> = []

  constructor(private adminPanelServices: AdminPanelService, public router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'))
      if (this.loggedInuserDetails) {
        this.getChannelPartnerList();
        this.getOrganisationNames();
        this.getProjectNames();
        this.getallusersList();
        this.cpAdminPanelModel.Organisation = "";
        this.cpAdminPanelModel.BrokerId = "";
        this.cpAdminPanelModel.ProjectName = "";
        this.cpAdminPanelModel.PanStatus = "";
      }
    }
  }
  onOrganisationChange = (organisation) => {
    if (organisation == "Individual")
      this.showBrokerName = true;
    else
      this.showBrokerName = false;
  }
  getOrganisationNames = () => {
    const getAllOrgnisationSub = this.adminPanelServices.getAllOrgnisation(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.AllOrganisation = response["data"][1];
        this.AllBroker = response["data"][0];
      }
    });
    this.reportSubscription.push(getAllOrgnisationSub);
  }
  getProjectNames = () => {
    const getAllProjectNamesSub = this.adminPanelServices.getAllProjectNames(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.allProjectNames = response["data"];
      }
    });
    this.reportSubscription.push(getAllProjectNamesSub);
  }
  getChannelPartnerList = () => {
    this.showChannelPartnerInfo = true;
    const getAllCPlistForApprovalSub = this.adminPanelServices.getAllCPlistForApproval(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.selectedChannelPartnerNames = response["data"];
        this.cpApprovalListNotFound = false;
      }
      else {
        this.cpApprovalListNotFound = true;
      }
      this.showChannelPartnerInfo = false;
    });
    this.reportSubscription.push(getAllCPlistForApprovalSub);
  }
  // get all users list
  getallusersList = () => {
    this.isLoading = true;
    const getAllUsersSub = this.adminPanelServices.getAllUsers(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.allusersDetails = response["data"];
        this.storeData = response["data"];
      }
      this.isLoading = false;
    });
    this.reportSubscription.push(getAllUsersSub);
  }
  //************* filter table popup data **************//
  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.allusersDetails : this.storeData;
        this.allusersDetails = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.allusersDetails = counter === 0 ? this.storeData : this.allusersDetails;
  }
  OnSubmitBtnClick = (cpAdminPanelModel, AssignProjectToOrganisationForm) => {
    if (cpAdminPanelModel.Organisation == "Individual") {
      cpAdminPanelModel.Organisation = "";
    }
    const projectAssignToOrganisationSub = this.adminPanelServices.projectAssignToOrganisation(this.loggedInuserDetails, cpAdminPanelModel).subscribe((response) => {
      if (response['successful']) {
        this.showSuccessBar("Project Assigned Successfully.");
        cpAdminPanelModel.Organisation = "";
        cpAdminPanelModel.BrokerId = "";
        cpAdminPanelModel.ProjectName = "";
        AssignProjectToOrganisationForm.form.markAsPristine();
        AssignProjectToOrganisationForm.form.markAsUntouched();
      } else {
        this.showFailedBar("Project Assigned Successfully.");
      }
    });
    this.reportSubscription.push(projectAssignToOrganisationSub);
  }

  showImageAdhar = (details) => {
    this.showImageModel.show();
    if (details.ImageUrl != null && details.AadharNo != null) {
      this.isLoading = true;
      this.imagesArray = details.ImageUrl.split('*#*');
      this.imagesArray.forEach((item, index) => {
        this.seperateImage = item.split('=');
        if (this.seperateImage[0] === "Aadhar") {
          this.images = this.seperateImage[1];
          this.isShowImage = true;
          this.isLoading = false;
        }
      })
    } else {
      this.isShowImage = false;
      this.imageNotAvailable = "Image is Not Available.";
    }
  }
  showImagePan = (details) => {
    this.showImageModel.show();
    if (details.ImageUrl != null && details.PanNo != null) {
      this.isLoading = true;
      this.imagesArray = details.ImageUrl.split('*#*');
      this.imagesArray.forEach((item, index) => {
        this.seperateImage = item.split('=');
        if (this.seperateImage[0] === 'Pan') {
          this.images = this.seperateImage[1];
          this.isShowImage = true;
          this.isLoading = false;
        }
      })
    } else {
      this.isShowImage = false;
      this.imageNotAvailable = "Image is Not Available.";
    }
  }
  onCloseImage = () => {
    this.showImageModel.hide();
  }
  getApproved = (cpApprove) => {
    this.ConfirmationModel.show();
    this.isOn = true;
    this.BrokerId = cpApprove.BrokerId;
  }
  getDecline = (cpDecline) => {
    this.ConfirmationModel.show();
    this.BrokerId = cpDecline.BrokerId;
    this.isOn = false;
  }
  confirmApproval = () => {
    const updateCpStatusSub = this.adminPanelServices.updateCpStatus(this.loggedInuserDetails, this.BrokerId).subscribe((response) => {
      if (response && response["data"]) {
        this.getChannelPartnerList();
        this.ConfirmationModel.hide();
      }
    });
    this.reportSubscription.push(updateCpStatusSub);
  }
  // update pan status on popup
  confirmPanApproval = (PanStatus) => {
    this.storePanDetails['PanStatus'] = PanStatus;
    const updatePanStatusSub = this.adminPanelServices.updatePanStatus(this.loggedInuserDetails, this.storePanDetails).subscribe((response) => {
      if (response && response["successful"]) {
        this.getallusersList();
        this.PanConfirmationModel.hide();
        this.snackBar.open('Updated Successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] });
      }
      else
        this.snackBar.open('Failed', null, { duration: 5000, panelClass: ['red-snackbar'] });
    });
    this.reportSubscription.push(updatePanStatusSub);
  }
  // varify pan details
  // varifyPan = (panDetails) => {
  //   if (panDetails['FullName'] && panDetails['PanNo'] && panDetails['PANType'] && panDetails['DateOfBirth']) {
  //     this.adminPanelServices.varifyPandetails(this.loggedInuserDetails, panDetails).subscribe((response) => {
  //     });
  //   }
  //   else {
  //     this.snackBar.open('Pancard details should not be null', null, { duration: 5000, panelClass: ['red-snackbar'] });
  //   }
  // }
  confirmDecline = () => {
    const declineCpStatusSub = this.adminPanelServices.declineCpStatus(this.loggedInuserDetails, this.BrokerId).subscribe((response) => {
      if (response && response["data"]) {
        this.getChannelPartnerList();
        this.ConfirmationModel.hide();
      }
    });
    this.reportSubscription.push(declineCpStatusSub);
  }
  close = () => {
    this.ConfirmationModel.hide();
    this.PanConfirmationModel.hide();
  }
  // open popup for update pan status
  openPanPopup = (data) => {
    this.PanConfirmationModel.show();
    this.storePanDetails = data;
    this.cpAdminPanelModel.PanStatus = data.PANVerificationStatus ? data.PANVerificationStatus : null;
  }
  //------- success snabar method -------//
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
   //** action for ng On Destroy  **/
   ngOnDestroy() {
    for (let item of this.reportSubscription) {
      item.unsubscribe();
    }
  }
}
