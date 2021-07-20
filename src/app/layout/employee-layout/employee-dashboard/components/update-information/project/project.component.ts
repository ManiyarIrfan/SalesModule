import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProjectService } from 'src/app/shared/services/employee/project.service';
import { routerTransition } from 'src/app/router.animations';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { ProjectStatusEmployeeService } from 'src/app/shared/services/employee/project-status-employee.service';
import { IstoreData, IprojectInsertModal, IpaymentInsertModal, IprojectModal } from 'src/app/shared/models/employeeModel/project.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'tru-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: [routerTransition()]
})
export class ProjectComponent implements OnInit,OnDestroy {
  public showmilestone: string[] = [];
  public storeData: IstoreData = <IstoreData>{};
  public isShow: boolean = false;
  @ViewChild('updateProjectModal', { static: false }) public updateProjectModal: ModalDirective;
  @ViewChild('createProject', { static: false }) public createProject: ModalDirective;
  public isProjectAvailable: boolean;
  public showAvailable: string;
  public projectInsertModal: IprojectInsertModal = <IprojectInsertModal>{};
  public paymentInsertModal: IpaymentInsertModal = <IpaymentInsertModal>{};
  public isCollapsed = true;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public isSpinnerActive: boolean = true;
  public projectModal: IprojectModal = <IprojectModal>{};
  public projectForm: string[] = [];
  public showProject: string;
  public projectid: number;
  public disableFieldsBylogin: boolean = true;
  public term: string;
  public p: number;
  public reraApprovalType: any = [
    { key: "YES", value: "YES" },
    { key: "NO", value: "NO" }];
  public projTypeInfo: any = [
    { key: "Residential", value: "Residential" },
    { key: "Commercial", value: "Commercial" },
    { key: "IT", value: "IT" }];
  public phase2Project: any = [];
  public DNDProject: any = [];
  public linkProjectModel: any = {};
  public selectedProjectNames: any = [];
  public showlinkedproject: string[] = [];
  public isEdit: boolean;
  public allProjectList: any = [];
  public title: string = '';
  public p1: number;
  public isNameAvailable: boolean;
  public showMsg: any;

  public _EventSubscription: Array<Subscription> = [];

  constructor(
    public router: Router,
    private projectServices: ProjectService,
    private snackBar: MatSnackBar,
    private projectStatusEmployeeService: ProjectStatusEmployeeService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails && this.loggedInuserDetails.Role === 1 || this.loggedInuserDetails.Role === 3 && this.loggedInuserDetails.Level == 'L1') {
        this.disableFieldsBylogin = false;
        this.getAllProjectDetails();
        this.getExeDnD();
      } else {
        this.getAllProjectDetails();
      }
      this.projectInsertModal.ProjectType = "";
      this.projectInsertModal.ReraApproval = "";
      this.getprojectList();
    }
    else {
      this.router.navigate(['/login']);
    }
    this.projectInsertModal.ReraApproval = "";
    this.projectModal.Phase2 = '';
    this.projectModal.Dnd = '';
  }
  //-------Get All ProjectName-------//
  getExeDnD() {
    const GetAllProjectNameSub = this.projectServices.GetAllProjectName(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.allProjectList = response["data"];
        this.phase2Project = response["data"][0];
        this.DNDProject = response["data"][1];
      }
    });
    this._EventSubscription.push(GetAllProjectNameSub);
  }
  //-------Get All ProjectName-------//
  getprojectList() {
    const GetProjectNameListSub = this.projectStatusEmployeeService.GetProjectNameList(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedProjectNames = response["data"];
      }
    });
    this._EventSubscription.push(GetProjectNameListSub);
  }
  //-------check if project already linked or not-------//
  GetAllProjectNametList() {
    this.linkProjectModel.Phase2 = '';
    this.linkProjectModel.Dnd = '';
    this.projectModal['Input'] = 'GETMappingProjectId';
    this.projectModal['type'] = 'Project';
    const GetPhase1ProjectsSub = this.projectServices.GetPhase1Projects(this.loggedInuserDetails, this.projectModal).subscribe((response) => {
      if (response && response["data"]) {
        this.showlinkedproject = response["data"][0][0];
        if (this.showlinkedproject === undefined || this.showlinkedproject === null) {
          this.phase2Project = this.allProjectList[0].filter(x => x['LinkedProject'] === null);
          this.DNDProject = this.allProjectList[1].filter(x => x['LinkedProject'] === null);
          this.isEdit = false;
          this.title = "Link Projects";
        }
        if (this.showlinkedproject && (this.showlinkedproject['ExecutionId'] || this.showlinkedproject['DndId'])) {
          this.phase2Project = this.allProjectList[0];
          this.DNDProject = this.allProjectList[1];
          this.linkProjectModel.Phase2 = this.showlinkedproject && this.showlinkedproject['ExecutionId'] ? this.allProjectList[0].find(x => x['ProjectId'] === this.showlinkedproject['ExecutionId']).ProjectId : null;
          this.linkProjectModel.Dnd = this.showlinkedproject && this.showlinkedproject['DndId'] ? this.allProjectList[1].find(y => y['ProjectId'] === this.showlinkedproject['DndId']).ProjectId : null;
          this.isEdit = (this.showlinkedproject && this.showlinkedproject['ExecutionId'] || this.showlinkedproject['DndId']) ? true : false;
          this.title = "Linked Projects";
        }
      }
    });
    this._EventSubscription.push(GetPhase1ProjectsSub);
  }
  //------- Map project if not linked -------//
  InsertProjectLink(linkForm) {
    if (this.linkProjectModel.Phase2 || this.linkProjectModel.Dnd) {
      this.linkProjectModel['Phase1'] = this.projectModal.ProjectId ? this.projectModal.ProjectId : null;
      this.linkProjectModel['TenantId'] = this.projectModal.TenantId ? this.projectModal.TenantId : null;
      const InsertProjectlinksSub = this.projectServices.InsertProjectlinks(this.loggedInuserDetails, this.linkProjectModel).subscribe((response) => {
        if (response && response['successful']) {
          this.updateProjectModal.hide();
          this.snackBar.open('Project Linked Successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] });
          this.getExeDnD();
          this.linkProjectModel.Phase2 = '';
          this.linkProjectModel.Phase2 = '';
          linkForm.form.markAsPristine();
          linkForm.form.markAsUntouched();
        }
        else
          this.snackBar.open('Failed', null, { duration: 7000, panelClass: ['red-snackbar'] });
      });
      this._EventSubscription.push(InsertProjectlinksSub);
    }
    else {
      this.snackBar.open('Please select atleast one project to link', null, { duration: 5000, panelClass: ['red-snackbar'] });
    }
  }

  getAllProjectDetails = () => {
    const GetAllProjectSub = this.projectServices.GetAllProject(this.loggedInuserDetails).subscribe((response) => {
      if (response["data"] && response["data"]) {
        this.showProject = response["data"];
        this.projectModal['userType'] = "employee";
        this.isSpinnerActive = false;
      } else {
        this.isSpinnerActive = false;
      }
    });
    this._EventSubscription.push(GetAllProjectSub);
  }
  //------- check duplicate project name -------//
  getProjectValidation = (projectName) => {
    if (projectName) {
      var projectpattern: any = /[a-zA-Z0-9 ]/;
      if (projectpattern.test(String(projectName).toLowerCase()) && projectpattern.test(String(projectName).toLowerCase()) != null) {
        const getProjectNameValidationSub = this.projectServices.getProjectNameValidation(this.loggedInuserDetails, projectName, 'Project').subscribe((response) => {
          if (response && response['data']) {
            this.isProjectAvailable = (response['data'][0].IsAvailable === 'Available');
            this.showAvailable = response['data'][0].IsAvailable;
          }
        });
        this._EventSubscription.push(getProjectNameValidationSub);
      }
    }

  }
  //------- Create new project -------//
  OnInsertBtnClick = (data, projectCreateForm) => {
    const InsertProjectDetailsSub = this.projectServices.InsertProjectDetails(data, this.loggedInuserDetails).subscribe((response) => {
      if (response['successful']) {
        (this.projectInsertModal.Phase2 || this.projectInsertModal.Dnd) ? this.snackBar.open('Project Created & Linked Successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] }) : this.snackBar.open('Project Created Successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] });
      } else {
        this.snackBar.open('Project Creation Failed', null, { duration: 5000, panelClass: ['red-snackbar'] });
      }
      this.getExeDnD();
      this.clearInsertField(projectCreateForm);
      this.showAvailable = "";
      this.getAllProjectDetails();
      this.createProject.hide();
      this.projectInsertModal.ReraApproval = "";
    });
    this._EventSubscription.push(InsertProjectDetailsSub);
  }
  clearInsertField = (projectCreateForm: NgForm) => {
    this.projectInsertModal = <IprojectInsertModal>{};
    projectCreateForm.form.markAsPristine();
    projectCreateForm.form.markAsUntouched();
    this.projectInsertModal.ProjectType = "";
    this.projectInsertModal.ReraApproval = "";
  }
  clearUpdateField = (projectForm: NgForm) => {
    this.projectModal = <IprojectModal>{};
    projectForm.form.markAsPristine();
    projectForm.form.markAsUntouched();
    this.projectModal.ProjectType = "";
    this.projectModal.ReraApproval = "";
  }
  OnUpdateBtnClick = (insertProjectModal, projectForm) => {
    this.projectid = this.projectModal.ProjectId;
    const UpdateProjectDetailsSub = this.projectServices.UpdateProjectDetails(this.projectModal, this.loggedInuserDetails).subscribe((response) => {
      if (response['successful']) {
        this.snackBar.open('project details with Project ID :' + this.projectid + ' updated successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] })
      } else {
        this.snackBar.open('Failed to update project details', null, { duration: 5000, panelClass: ['red-snackbar'] });
      }
      this.clearUpdateField(projectForm);
      this.updateProjectModal.hide();
    });
    this._EventSubscription.push(UpdateProjectDetailsSub);
  }

  emitProjectID = (projectDetails) => {
    this.projectModal = projectDetails;
    (this.loggedInuserDetails.Role === 1 && this.loggedInuserDetails.Level === 'L1') ? this.GetAllProjectNametList() : null;
    this.updateProjectModal.show();
  }
  OnCloseBtnClick = (projectForm, projectCreateForm) => {
    this.updateProjectModal.hide();
    this.projectServices.GetAllProject(this.loggedInuserDetails);
    this.clearUpdateField(projectForm);
    this.clearInsertField(projectCreateForm);
    this.getAllProjectDetails();
  }
  ClearAvailableMessage = () => {
    this.showAvailable = " ";
  }
  onClose(projectCreateForm) {
    //------close modal and clear messages-------//
    this.createProject.hide();
    this.clearInsertField(projectCreateForm);
    this.ClearAvailableMessage();
    //-------End-------//
  }
  OpenForm(data, Input) {
    this.storeData = data ? data : null;
    this.paymentInsertModal.ProjectName = this.storeData.ProjectName;
    this.isShow = (Input === 'open') ? true : false;
    this.getMilestoneData();
  }
  InsertPaymentMilestone(CreateForm) {
    this.paymentInsertModal['ProjectId'] = this.storeData.ProjectId;
    this.paymentInsertModal['ProjectName'] = this.storeData.ProjectName;
    const InsertMilestoneSub = this.projectServices.InsertMilestone(this.loggedInuserDetails, this.paymentInsertModal).subscribe((response) => {
      if (response['successful']) {
        this.snackBar.open('Inserted successfully', null, { duration: 5000, panelClass: ['blue-snackbar'] })
      } else {
        this.snackBar.open('Failed to Insert', null, { duration: 5000, panelClass: ['red-snackbar'] });
      }
      this.getMilestoneData();
      this.paymentInsertModal = <IpaymentInsertModal>{};
      CreateForm.form.markAsPristine();
      CreateForm.form.markAsUntouched();
      this.paymentInsertModal.ProjectName = this.storeData.ProjectName ? this.storeData.ProjectName : null;
    });
    this._EventSubscription.push(InsertMilestoneSub);
  }
  getMilestoneData() {
    const GetAllMilestoneDataSub = this.projectServices.GetAllMilestoneData(this.loggedInuserDetails, this.storeData.ProjectId).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.showmilestone = response["data"];
      }
      else {
        this.showmilestone = [];
      }
    });
    this._EventSubscription.push(GetAllMilestoneDataSub);
  }
  MilestoneNameValidation = (name) => {
    const MilestoneValidationSub = this.projectServices.MilestoneValidation(name, this.storeData.ProjectId).subscribe((response) => {
      if (response && response["data"] && response["data"][0]) {
        this.isNameAvailable = (response["data"][0].IsAvailable === 'Available');
        this.showMsg = response["data"][0].IsAvailable;
      }
    });
    this._EventSubscription.push(MilestoneValidationSub);
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.createProject.hide();
      this.updateProjectModal.hide();
    }
  }
  openmodal() {
    //-------open modal on create button-------//
    this.isEdit = false;
    this.createProject.show();
    (this.loggedInuserDetails.Role === 1 && this.loggedInuserDetails.Level === 'L1') ? this.GetAllProjectNametList() : null;
    //-------End-------//
  }
   //** action for ng On Destroy  **/
   ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}