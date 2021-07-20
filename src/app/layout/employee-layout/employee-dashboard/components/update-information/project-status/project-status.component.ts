import { Component, OnInit, ViewChild, destroyPlatform, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectStatusEmployeeService } from 'src/app/shared/services/employee/project-status-employee.service';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { EncryptDecryptService } from 'src/app/shared/services/shared/encrypt-decrypt.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IProjectStatusModel, IlinkProjectModel } from 'src/app/shared/models/employeeModel/project-status.model';

@Component({
  selector: 'tru-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit, OnDestroy {

  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public isSpinnerActive: boolean = true;
  public uploadProjectStatusImages: FileAttachment[] = [];
  public selectedProjectNames: string[] = [];
  public showProjectStatus: string[] = [];
  public PlannedActivityList: string[] = [];
  public displayArray: string = "";
  public message: string = "";

  public popUpHeading: string;
  public isShowProjectDetails: boolean;
  public images: string[];
  public imageNotAvailable: string = "";
  public projectname: string;
  public buildingtype: string;
  public ProjectStatusModel: IProjectStatusModel = <IProjectStatusModel>{};
  public linkProjectModel: IlinkProjectModel = <IlinkProjectModel>{};
  public isShowImage: boolean = false;
  public isShow: boolean = false;
  public Search: string;
  public imagesArray: string[] = [];
  public imageUrlList: string;
  public popHeading: string;
  public deleteUrlListArray: string[] = [];
  public deleteUrlList: string;
  public confirmDeleteUrl: string;
  public isOn: boolean;
  public disableOnLoggedin: boolean = true;
  public isLoading: boolean = false;
  public index: number;
  public CurrentPageId: number = 1;
  public isBuildingAvailable: boolean;
  public showDuplicate: string = '';
  public executionSubProject: string[] = [];
  public DNDSubProject: string[] = [];
  public p2: number;
  public isEdit: boolean;

  @ViewChild('confirmDeleteModel', { static: false }) public confirmDeleteModel: ModalDirective;
  @ViewChild('createProjectStatusModel', { static: false }) public createProjectStatusModel: ModalDirective;
  @ViewChild('showProjectStatusImageModal', { static: false }) public showProjectStatusImageModal: ModalDirective;
  @ViewChild('alertPopup', { static: false }) public alertPopup: ModalDirective;

  public OnUpdateBtnClickSubscription: Subscription;
  public getprojectListSubscription: Subscription;
  public OnSubmitBtnClickSubscription: Subscription;
  public getAllProjectStatusSubscription: Subscription;
  public onProjectChangeSubscription: Subscription;
  public GetAllProjectNameSubscription: Subscription;
  public SubProjectNameValidationSubscription: Subscription;
  public InsertProjectlinksSubscription: Subscription;
  public showlinkedproject: object[]=[];
  public storeexecutionSubProject: string[] = [];
  public storeDNDSubProject: string[] = [];
  public phase2Project: string[] = [];
  public DNDProject: string[] = [];
  public text: string = '';
  public AllProjectAndSubProjectList: object;
  public title: string = '';

  constructor(
    private projectStatusEmployeeService: ProjectStatusEmployeeService,
    public router: Router,
    private encryptDecryptService: EncryptDecryptService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        if (sessionStorage.projectstatus) {
          const Data = JSON.parse(sessionStorage.getItem('projectstatus'));
          const decryptedData = this.encryptDecryptService.decryptData(Data);
          this.CurrentPageId = decryptedData[0]['CurrentPageId'] ? decryptedData[0]['CurrentPageId'] : 1;
          this.showProjectStatus = decryptedData[0]['showProjectStatus'].length > 0 ? decryptedData[0]['showProjectStatus'] : [];
          this.CurrentPageId === 1 ? this.refreshData() : null;
          this.isSpinnerActive = false;
        } else {
          this.refreshData();
        }
      } else {
        this.router.navigate([`/login`]);
      }
      this.exeDndSubProject();
      this.getprojectList();
      this.ProjectStatusModel.exeSubProject = '';
      this.ProjectStatusModel.dndSubProject = '';
    }
  }
  refreshData() {
    this.getAllProjectStatus();
    this.getprojectList();
  }
  getprojectList() {
    //-------Get All ProjectName-------//
    this.getprojectListSubscription = this.projectStatusEmployeeService.GetProjectNameList(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedProjectNames = response["data"];
        this.ProjectStatusModel.ProjectName = "";
        this.ProjectStatusModel.BuildingType = "";
      }
    });
  }
  //-------Get All Project details-------//
  exeDndSubProject() {
    this.GetAllProjectNameSubscription = this.projectStatusEmployeeService.GetAllProjectName(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.AllProjectAndSubProjectList = response["data"];
        this.phase2Project = response["data"][0];
        this.DNDProject = response["data"][1];
        this.executionSubProject = response["data"] && response["data"][2] ? response["data"][2] : [];
        this.DNDSubProject = response["data"] && response["data"][3] ? response["data"][3] : [];
        this.storeDNDSubProject = response["data"] && response["data"][3] ? response["data"][3] : [];
        this.storeexecutionSubProject = response["data"] && response["data"][2] ? response["data"][2] : [];
      }
    });
  }
  //------- check if subproject already linked or not -------//
  GetAllProjectNametList() {
    this.linkProjectModel.exeSubProject = '';
    this.linkProjectModel.dndSubProject = '';
    this.ProjectStatusModel['Input'] = 'GETMappingSubProjectId';
    this.ProjectStatusModel['type'] = 'SubProject';
    this.showlinkedproject['ExecutionId'] = [];
    this.getprojectListSubscription = this.projectStatusEmployeeService.GetPhase1Projects(this.loggedInuserDetails, this.ProjectStatusModel).subscribe((response) => {
      if (response && response["data"]) {
        if (response["data"] && response["data"][0] && response["data"][0][0]) {
          this.showlinkedproject = response["data"][0][0];
          if (this.showlinkedproject['Column1'] !== '' && this.showlinkedproject['Column1'] !== undefined) {
            this.text = this.showlinkedproject['Column1'];
          }
          if (this.showlinkedproject && this.showlinkedproject['ExecutionId'] || this.showlinkedproject['DndId']) {
            this.executionSubProject = this.AllProjectAndSubProjectList[2];
            this.DNDSubProject = this.AllProjectAndSubProjectList[3];
            this.linkProjectModel.exeSubProject = this.showlinkedproject && this.showlinkedproject['ExecutionId'] ? this.storeexecutionSubProject.find(x => x['SubProjectId'] === this.showlinkedproject['ExecutionId'])['SubProjectId'] : null;
            this.linkProjectModel.dndSubProject = this.showlinkedproject && this.showlinkedproject['DndId'] ? this.storeDNDSubProject.find(y => y['SubProjectId'] === this.showlinkedproject['DndId'])['SubProjectId'] : null;
            this.isEdit = (this.linkProjectModel.exeSubProject || this.linkProjectModel.dndSubProject) ? true : false;
            this.text = "";
            this.title = "Linked SubProjects";
          }
          if (this.showlinkedproject && this.showlinkedproject['ExecutionProjectId'] || this.showlinkedproject['DndProjectId']) {
            this.executionSubProject = this.showlinkedproject && this.showlinkedproject['ExecutionProjectId'] ? this.storeexecutionSubProject.filter(x => x['ProjectId'] === this.showlinkedproject['ExecutionProjectId'] && x['LinkedProject'] === null) : [];
            this.DNDSubProject = this.showlinkedproject && this.showlinkedproject['DndProjectId'] ? this.storeDNDSubProject.filter(y => y['ProjectId'] === this.showlinkedproject['DndProjectId'] && y['LinkedProject'] === null) : [];
            this.text = "";
            this.isEdit = false;
          }
        }
      }
    });
  }
  //------- Map Subproject if not linked -------//
  InsertSubProjectLink(linkForm) {
    if (this.linkProjectModel.exeSubProject || this.linkProjectModel.dndSubProject) {
      this.linkProjectModel['type'] = 'SubProject';
      this.linkProjectModel['SubProjectId'] = this.ProjectStatusModel['SubProjectId'] ? this.ProjectStatusModel['SubProjectId'] : null
      this.linkProjectModel['TenantId'] = this.ProjectStatusModel['TenantId'] ? this.ProjectStatusModel['TenantId'] : null;
      this.InsertProjectlinksSubscription = this.projectStatusEmployeeService.InsertProjectlinks(this.loggedInuserDetails, this.linkProjectModel).subscribe((response) => {
        if (response && response['successful']) {
          this.createProjectStatusModel.hide();
          this.snackBar.open('SubProject Linked Successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] });
          this.exeDndSubProject();
          this.linkProjectModel.exeSubProject = '';
          this.linkProjectModel.dndSubProject = '';
          linkForm.form.markAsPristine();
          linkForm.form.markAsUntouched();
          this.getAllProjectStatus();
        }
        else
          this.snackBar.open('Failed', null, { duration: 7000, panelClass: ['red-snackbar'] });
      });
    }
    else {
      this.snackBar.open('Please select atleast one subproject to link', null, { duration: 5000, panelClass: ['red-snackbar'] });
    }
  }
  //------- check duplicate subproject validation -------//
  getSubProjectValidation = (projectName) => {
    if (projectName) {
      var projectpattern: any = /[a-zA-Z0-9 ]/;
      this.ProjectStatusModel['Input'] = 'SubProject';
      if (projectpattern.test(String(projectName).toLowerCase()) && projectpattern.test(String(projectName).toLowerCase()) != null) {
        this.SubProjectNameValidationSubscription = this.projectStatusEmployeeService.getSubProjectNameValidation(this.ProjectStatusModel).subscribe((response) => {
          if (response && response['data']) {
            this.isBuildingAvailable = (response['data'][0].IsAvailable === 'Available');
            this.showDuplicate = response['data'][0].IsAvailable;
          }
        });
      }
    }
  }
  pageChangeevent(CurrentPageId) {
    let Data = [];
    Data.push({
      showProjectStatus: this.showProjectStatus,
      CurrentPageId: CurrentPageId
    });
    let encryptedData = this.encryptDecryptService.encryptData(Data);
    sessionStorage.setItem('projectstatus', JSON.stringify(encryptedData));
  }

  getAllProjectStatus = () => {
    //-------Get All Project Status -------//
    this.getAllProjectStatusSubscription = this.projectStatusEmployeeService.GetAllProjectStutas(this.loggedInuserDetails).subscribe((response) => {
      this.showProjectStatus = [];
      if (response && response["data"]) {
        this.showProjectStatus = response["data"];
        this.isSpinnerActive = false;
        let Data = [];
        Data.push({
          showProjectStatus: this.showProjectStatus,
          CurrentPageId: this.CurrentPageId
        });
        let encryptedData = this.encryptDecryptService.encryptData(Data);
        sessionStorage.setItem('projectstatus', JSON.stringify(encryptedData));
      }
    });
  }

  onProjectChange = (projectValue) => {
    this.ProjectStatusModel.ProjectId = projectValue && projectValue !== '' ? this.selectedProjectNames.filter(x => x['ProjectName'] === projectValue)[0]['ProjectId'] : null;
    this.ProjectStatusModel.ProjectId ? this.GetAllProjectNametList() : null;
  }

  onClickCreate = () => {
    //-------if popup input PlannedActivity field is blank and more than 5 than error message will be show-------//
    this.message = ``;
    if (this.ProjectStatusModel.PlannedActivity) {
      if (this.PlannedActivityList.length < 5) {
        this.PlannedActivityList.push(this.ProjectStatusModel.PlannedActivity);
        this.ProjectStatusModel.PlannedActivity = '';
        this.displayArray = this.PlannedActivityList.join(',');
      } else {
        this.message = "More than 5 not allowed";
      }
    } else {
      this.message = "Can not insert blank value";
    }
  }

  OnSubmitBtnClick = (ProjectStatusModel, uploadProjectStatusImages, ProjectStatusForm) => {
    this.OnSubmitBtnClickSubscription = this.projectStatusEmployeeService.InsertProjectStatus(ProjectStatusModel, uploadProjectStatusImages, this.displayArray, this.loggedInuserDetails, this.linkProjectModel).subscribe((response) => {
      if (response && (response['successful'] || response['value'] && response['value'].successful)) {
        this.getAllProjectStatus();
        this.getprojectList();
        this.exeDndSubProject();
        this.showSuccessBar("Project Status Created Successfully.");
      } else {
        this.showFailedBar("Project Status Creation Failed.");
      }
      this.clearInput(ProjectStatusForm);
      this.ProjectStatusModel.ProjectName = "";
      this.ProjectStatusModel.BuildingType = "";
    });
  }
  emitDetails = (details, index: number) => {
    //-------All details related to that BuildingType Bottoon shown in PopUp-------//
    this.createProjectStatusModel.show();
    if (this.loggedInuserDetails.Role === 1 || this.loggedInuserDetails.Role === 3 && this.loggedInuserDetails.Level === 'L1') {
      this.disableOnLoggedin = false;
    }
    this.popHeading = "Update Project Status";
    this.ProjectStatusModel = details;
    this.projectname = details.ProjectName;
    this.buildingtype = details.BuildingType;
    this.imageUrlList = details.ImageUrl ? details.ImageUrl : '';
    this.GetAllProjectNametList();
    details.ImageUrl ? this.viewImage(details.ImageUrl) : null;
    this.isShow = true;
    this.isShowProjectDetails = false;
    this.onClickCreate();
    this.message = '';
  }
  viewImage = (imageUrlPath) => {
    //-------this show the image view in popup-------//
    if (imageUrlPath != null && imageUrlPath != "" && imageUrlPath != undefined) {
      this.imagesArray = imageUrlPath.split(',');
      if (this.imagesArray != null) {
        this.images = this.imagesArray;
        this.isShowImage = true;
      }
    } else {
      this.isShowImage = false;
      this.imageNotAvailable = "No Image Uploaded. Upload Image To Take Effect.";
      this.deleteUrlList = "";
    }
  }
  gridViewImage = (imageUrlPath) => {
    //-------this show the image in popup-------//
    if (imageUrlPath != null && imageUrlPath != "") {
      this.isLoading = true;
      this.imagesArray = imageUrlPath.split(',');
      this.isShow = true;
      if (this.imagesArray != null) {
        this.images = this.imagesArray;
        this.isOn = true;
        this.isLoading = false;
      }
    } else {
      this.isOn = false;
      this.imageNotAvailable = "No Image Uploaded. Upload Image To Take Effect.";
    }
    this.showProjectStatusImageModal.show();
  }
  clearInput = (ProjectStatusForm) => {
    //-------Clear All input field-------//
    this.ProjectStatusModel = <IProjectStatusModel>{};
    this.uploadProjectStatusImages = [];
    this.PlannedActivityList = [];
    ProjectStatusForm.form.markAsPristine();
    ProjectStatusForm.form.markAsUntouched();
  }
  onClose = (ProjectStatusForm) => {
    //-------reset popup Form and remove messages-------//
    this.createProjectStatusModel.hide();
    this.clearInput(ProjectStatusForm);
    this.message = ``;
    this.getAllProjectStatus();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.onCloseBtn();
      this.onClose(event);
    }
  }
  openmodal() {
    //-------open modal on create button-------//
    this.disableOnLoggedin = false;
    this.createProjectStatusModel.show();
    this.popHeading = "Create Project Status";
    this.executionSubProject = [];
    this.DNDSubProject = [];
    this.text = '';
    this.showDuplicate = '';
    this.isEdit = false;
    this.title = "Link Subprojects";
    this.ProjectStatusModel.ProjectName = "";
    this.ProjectStatusModel.BuildingType = "";
    this.imageNotAvailable = "";
    this.isShow = false;
    this.isShowImage = false;
  }
  getFutureDate(): string {
    //-------can not select future date-------//
    return new Date().toISOString().split('T')[0];
  }
  onItemDeleted(imageUrl) {
    this.confirmDeleteModel.show();
    this.confirmDeleteUrl = imageUrl;
  }
  confirmDeleted() {
    let index = this.imagesArray.indexOf(this.confirmDeleteUrl);
    if (index != -1) {
      this.imagesArray.splice(index, 1);
    }
    this.deleteUrlListArray.push(this.confirmDeleteUrl);
    this.deleteUrlList = this.deleteUrlListArray.join(',');
    this.confirmDeleteModel.hide();
    this.isShowImage = false;
    this.imageNotAvailable = "Click On Update To Take Effect On Image.";
  }
  notConfirm() {
    this.confirmDeleteModel.hide();
  }
  OnUpdateBtnClick = (ProjectStatusForm) => {
    this.OnUpdateBtnClickSubscription = this.projectStatusEmployeeService.updateProjectStatus(this.loggedInuserDetails, this.ProjectStatusModel, this.displayArray, this.deleteUrlList, this.uploadProjectStatusImages, this.imageUrlList).subscribe((response) => {
      if (response && (response['successful'] || response['value']['successful'])) {
        this.showSuccessBar("Project Status Updated Successfully.");
        this.getAllProjectStatus();
      } else {
        this.showFailedBar("Project Status Updation Failed.");
      }
      this.clearInput(ProjectStatusForm);
      this.ProjectStatusModel.ProjectName = this.projectname;
      this.ProjectStatusModel.BuildingType = this.buildingtype;
      this.confirmDeleteUrl = '';
      this.imageUrlList = '';
      this.deleteUrlListArray = [];
    });
  }
  onCloseBtn = () => {
    this.showProjectStatusImageModal.hide();
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy() {
    this.GetAllProjectNameSubscription ? this.GetAllProjectNameSubscription.unsubscribe() : null;
    this.SubProjectNameValidationSubscription ? this.SubProjectNameValidationSubscription.unsubscribe() : null;
    this.InsertProjectlinksSubscription ? this.InsertProjectlinksSubscription.unsubscribe() : null;
    this.getprojectListSubscription ? this.getprojectListSubscription.unsubscribe() : null;
    this.OnUpdateBtnClickSubscription ? this.OnUpdateBtnClickSubscription.unsubscribe() : null;
    this.OnSubmitBtnClickSubscription ? this.OnSubmitBtnClickSubscription.unsubscribe() : null;
    this.getAllProjectStatusSubscription ? this.getAllProjectStatusSubscription.unsubscribe() : null;
    this.onProjectChangeSubscription ? this.onProjectChangeSubscription.unsubscribe() : null;
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