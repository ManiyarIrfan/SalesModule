import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { ProjectDetailService } from 'src/app/shared/services/employee/project-detail.service';
import { EncryptDecryptService } from 'src/app/shared/services/shared/encrypt-decrypt.service';
import { IfilterProjectModel } from 'src/app/shared/models/employeeModel/FilterDetails.model';
import { IprojectModel, IprojDetailModel } from 'src/app/shared/models/employeeModel/project-details.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tru-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  public filterDataModel: IfilterProjectModel = <IfilterProjectModel>{};
  public showflatNotFoundMessage: boolean = true;
  public projectModel: IprojectModel = <IprojectModel>{};
  public allProjectDetailsData: string;
  public FilteredProjectDetails: string[] = [];
  public showResult: string[] = [];
  public projectValue: string;
  public ReraSearch: string;
  public buildingType: string;
  public FlatViewSearch: string;
  public UnitNoSearch: number;
  public LayoutTypeSearch: string;
  public FlatViewSeReraSearcharch: string;
  public BhkSearch: string;
  public AvailableSearch: string;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public projDetailModel: IprojDetailModel = <IprojDetailModel>{};
  public selectedProjectNames: string[] = [];
 
  public showMessageOnDuplicateFlat: string;
  public flatDuplicateFlag: boolean;
  public flatno: string;
  public selectedBuildingType: string;
  public disableFieldsByLogin: boolean = true;
  public selectedProject: string;
  public showUpdateParameters: boolean = false;
  public modalHeader: string;
  public hideUpdateBtn: boolean = false;
  public showTable: boolean = false;
  public isLoading: boolean = false;

  public GetAllProjectNameSubscription: Subscription;
  public CheckDuplicateFlatDetailsSubscription: Subscription;
  public GetBHKDetailsOnSelectedBuildingtypeSubscription: Subscription;
  public InsertProjectDetailsSubscription: Subscription;
  public UpdateProjectDetailsSubscription: Subscription;
  public OnSelectedBuildingtypeSubscription: Subscription;
  public onProjectChangeSubscription: Subscription
  public CurrentPageId: number = 1;
  public getBuildingTypeList: string[] = [];
  public ListOffilter = [
    { item: 'FlatNo' },
    { item: 'Floor' },
    { item: 'Available' },
    { item: 'LayoutType' },
    { item: 'FlatView' },
    { item: 'BHK' }
  ];

  @ViewChild('createProjectDetailsModel', { static: false }) public createProjectDetailsModel: ModalDirective;
  constructor(
    private projectDeatailServices: ProjectDetailService,
    private encryptDecryptService: EncryptDecryptService,
    public router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails && this.loggedInuserDetails.Role === 1 || (this.loggedInuserDetails.Role === 3 && this.loggedInuserDetails.Level !== 'L3')) {
        this.disableFieldsByLogin = false;
        this.projDetailModel['EntityId'] = this.loggedInuserDetails['EntityId'];
      }
      this.GetSelectedProjectsList();
    } else {
      this.router.navigate(['/login']);
    }
  }
  GetSelectedProjectsList = () => {
    //-------service call to get project list-------//
    this.GetAllProjectNameSubscription = this.projectDeatailServices.GetAllProjectName(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedProjectNames = response["data"];
        if (this.selectedProjectNames && this.selectedProjectNames[0]) {
          this.projDetailModel.ProjectName = "";
        }
        if (sessionStorage.projectdetails) {
          var Data = JSON.parse(sessionStorage.getItem('projectdetails'));
          let decryptedData = this.encryptDecryptService.decryptData(Data);
          this.showResult = decryptedData[0]['showResult'] ? decryptedData[0]['showResult'] : [];
          this.selectedProject = decryptedData[0]['selectedProject'] ? decryptedData[0]['selectedProject'] : '';
          this.selectedBuildingType = decryptedData[0]['selectedBuildingType'] ? decryptedData[0]['selectedBuildingType'] : [];
          this.showTable = true;
          this.showflatNotFoundMessage = true;
          this.FilteredProjectDetails = decryptedData[0]['FilteredProjectDetails'] ? decryptedData[0]['FilteredProjectDetails'] : [];
          this.CurrentPageId = decryptedData[0]['CurrentPageId'] ? decryptedData[0]['CurrentPageId'] : 1;
          this.GetBuildingdetilsOnProject(this.selectedProject);
        }
      }
    });
  }
  checkFlatDuplicate = (projectModel) => {
    //-------check the duplicate flat -------//
    if (projectModel.FlatNo) {
      this.CheckDuplicateFlatDetailsSubscription = this.projectDeatailServices.CheckDuplicateFlatDetails(this.loggedInuserDetails, projectModel).subscribe((response) => {
        if (response['data'][0] != null) {
          this.showMessageOnDuplicateFlat = "Flat is Already Exist";
          this.flatDuplicateFlag = false;
        } else {
          this.showMessageOnDuplicateFlat = "Available";
          this.flatDuplicateFlag = true;
        }
      });
    }
  }
  clearTextMsg = () => {
    //-------clear duplicate flat-------//
    this.showMessageOnDuplicateFlat = " ";
  }
  GetBuildingdetilsOnProject = (projectValue) => {
    //-------get building name from Project select-------//
    if (projectValue) {
      this.projectModel.ProjectName = projectValue;
    }
    if (this.loggedInuserDetails) {
      this.GetBHKDetailsOnSelectedBuildingtypeSubscription = this.projectDeatailServices.GetBHKDetailsOnSelectedBuildingtype(this.loggedInuserDetails, this.projectModel.ProjectName).subscribe((response) => {
        if (response["data"]) {
          this.buildingType = response["data"];
          this.selectedBuildingType = "All";
          this.projectModel.buildingType = "All";
        }
      });
    }
  }
  onProjectChange(projectValue) {
    //-------service call if project is change-------//
    this.GetBuildingdetilsOnProject(projectValue);
    if (projectValue) {
      this.OnShowProjectDetailsBtn();
    }
  }
  onBuildingTypeChange(BuldingTypeValue) {
    //-------service call if building type change-------//
    this.projectModel.buildingType = BuldingTypeValue;
    this.OnShowProjectDetailsBtn()
  }
  OnSubmitBtnClick = (CreateProjectDetailForm) => {
    //------service call for insert project details-------//
    this.InsertProjectDetailsSubscription = this.projectDeatailServices.InsertProjectDetails(this.projDetailModel, this.loggedInuserDetails).subscribe((response) => {
      if (response['successful']) {
        this.CreateInput(CreateProjectDetailForm);
        this.showSuccessBar("Project Details Submitted Successfully.");
        this.clearTextMsg();
      } else {
        this.showFailedBar("Project Details Not Submitted Successfully");
      }
    });
  }
  OnUpdateButton = (CreateProjectDetailForm) => {
    //-------service call for update project details-------//
    this.UpdateProjectDetailsSubscription = this.projectDeatailServices.UpdateProjectDetails(this.projDetailModel, this.loggedInuserDetails, this.projectModel).subscribe((response) => {
      if (response['successful']) {
        this.CreateInput(CreateProjectDetailForm);
        this.showSuccessBar("Project Details Updated Successfully.");
      } else {
        this.showFailedBar("Project Details Not Updated Successfully");
      }
      this.projDetailModel.FlatNo = this.flatno;
    });
  }

  CreateInput = (CreateProjectDetailForm) => {
    //-------clear input form-------//
    this.projDetailModel = <IprojDetailModel>{};
    CreateProjectDetailForm.form.markAsPristine();
    CreateProjectDetailForm.form.markAsUntouched();
  }
  updateprojectDetails = (projectDetails) => {
    //-------Service call for update project details-------//
    this.projDetailModel = projectDetails;
    this.projectModel.buildingType = projectDetails.BuildingType;
    this.projDetailModel.Available = (projectDetails.Available && projectDetails.Available !== '') ? projectDetails.Available.toLocaleLowerCase() : null;
    this.projDetailModel.Remark = (projectDetails.Remark && projectDetails.Remark !== '') ? projectDetails.Remark : null;
    this.flatno = projectDetails.FlatNo;
    this.modalHeader = "Update Project Details";
    this.createProjectDetailsModel.show();
    this.showUpdateParameters = true;
    //-------End-------//
  }
  onClose = (CreateProjectDetailForm) => {
    //-------Close Modal PopUp-------//
    this.CreateInput(CreateProjectDetailForm);
    this.createProjectDetailsModel.hide();
    //-------End-------//
  }
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.createProjectDetailsModel.hide();
    }
  }

  OnShowProjectDetailsBtn = () => {
    //-------Search Button Show all Data-------//
    this.isLoading = true;
    this.showflatNotFoundMessage = true;
    this.showResult = [];
    this.showTable = false;
    this.OnSelectedBuildingtypeSubscription = this.projectDeatailServices.OnSelectedBuildingtype(this.loggedInuserDetails, this.projectModel).subscribe((response) => {
      if (response && response["data"].length > 0) {
        this.allProjectDetailsData = this.showResult = response["data"];
        this.FilteredProjectDetails = this.showResult;
        let Data = [];
        Data.push({ showResult: this.showResult, selectedProject: this.selectedProject, buildingType: this.buildingType, selectedBuildingType: this.selectedBuildingType, FilteredProjectDetails: this.FilteredProjectDetails, CurrentPageId: this.CurrentPageId });
        let encryptedData = this.encryptDecryptService.encryptData(Data);
        sessionStorage.setItem('projectdetails', JSON.stringify(encryptedData));
        this.showTable = true;
        this.showflatNotFoundMessage = true;
      } else {
        let Data = [];
        Data.push({ showResult: [], selectedProject: this.selectedProject, buildingType: this.buildingType, selectedBuildingType: this.selectedBuildingType, FilteredProjectDetails: this.FilteredProjectDetails, CurrentPageId: this.CurrentPageId });
        let encryptedData = this.encryptDecryptService.encryptData(Data);
        sessionStorage.setItem('projectdetails', JSON.stringify(encryptedData));
        this.showflatNotFoundMessage = false;
      }
      this.isLoading = false;
    });
    //-------End-------//
  }
  openCreateModal() {
    //-------open modal on create button-------//
    this.createProjectDetailsModel.show();
    this.showUpdateParameters = false;
    this.hideUpdateBtn = true;
    this.modalHeader = "Create Project Details";
    //-------End-------//
  }

  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        const Data = counter > 0 ? this.showResult : this.FilteredProjectDetails;
        this.showResult = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.showResult = counter === 0 ? this.FilteredProjectDetails : this.showResult;
  }
  onProjectChangePopup = () => {
    //-------Get Building Type Related to that projectName -------//
    this.onProjectChangeSubscription = this.projectDeatailServices.GetBHKDetailsOnSelectedBuildingtype(this.loggedInuserDetails, this.projDetailModel.ProjectName).subscribe((response) => {
      if (response && response["data"]) {
        this.getBuildingTypeList = response["data"];
      }
    });
  }
  ngOnDestroy() {
    //-------unsubscribe method-------//
    this.GetAllProjectNameSubscription ? this.GetAllProjectNameSubscription.unsubscribe() : null;
    this.CheckDuplicateFlatDetailsSubscription ? this.CheckDuplicateFlatDetailsSubscription.unsubscribe() : null;
    this.GetBHKDetailsOnSelectedBuildingtypeSubscription ? this.GetBHKDetailsOnSelectedBuildingtypeSubscription.unsubscribe() : null;
    this.InsertProjectDetailsSubscription ? this.InsertProjectDetailsSubscription.unsubscribe() : null;
    this.UpdateProjectDetailsSubscription ? this.UpdateProjectDetailsSubscription.unsubscribe() : null;
    this.OnSelectedBuildingtypeSubscription ? this.OnSelectedBuildingtypeSubscription.unsubscribe() : null;
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
}