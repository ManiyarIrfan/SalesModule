import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileManagementService } from 'src/app/shared/services/employee/file-management.service';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { EncryptDecryptService } from 'src/app/shared/services/shared/encrypt-decrypt.service';
import {IloggedInuserDetails} from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import {IfileManagementModel} from 'src/app/shared/models/employeeModel/file-management.model';

@Component({
  selector: 'tru-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit, OnDestroy {
  public showPdf = 'https://truimages.blob.core.windows.net/productionimages/Brochure/ProjectBrochure/';
  public selectedProjectNames: string[] = [];
  public selectedBrochureNames:string[] = [];
  public loggedInuserDetails: IloggedInuserDetails=<IloggedInuserDetails>{};
  public isLoadingDocumentFolders: boolean = false;
  public uploadPdfFileList: FileAttachment[] = [];
  public projectName: string = "";
  public Search: string;
  public uploadPdfSuccessfullMessage: any = "";
  public uploadPdfUnsuccessfullMessage: any = "";
  public TemplateModel: string;
  public fileManagementModel: IfileManagementModel=<IfileManagementModel>{};
  public Brochure: boolean = true;
  public ContentType: string;
  public popupHeading: string;
  public selectedProject:string[] = [];
  public brochure: string;
  public collapse: string;
  public showSuccessfullMessage: string = "";
  public showNotSuccessfullMessage: string = "";
  public editedIndex: string = null;
  public message: string;
  public projectNames: string;
  public DataNotFoundMessage: string = "";
  public DataNotFound: string = "";
  public showDataNotFoundMessage: boolean = false;
  public showDataNotFound: boolean = false;
  public KeyID: string;
  public Content: string;
  public selectedTemplateNames: string[] = [];
  public templateUpdate: boolean = false;
  public deleteType: string;
  public disableTemplateFields: boolean = false;
  public fileUrl: string;
  public fileName: string;
  public p1: number;
  public ckeConfig: string;
  public q1: number;
  public s1: number;
  public openProjectFolder: boolean = false;
  public confirmDeleteSubscribtion: Subscription;
  public brochureDeleteSubscribtion: Subscription;
  public smsTemplateSubscribtion: Subscription;
  public selectedProjectListSubscribtion: Subscription;
  public uploadPdfSubscribtion: Subscription;
  public allSmsNameSubscribtion: Subscription;
  public allBrochureSubscribtion: Subscription;
  public templateDetailsSubscribtion: Subscription;

  @ViewChild('showFileModal', { static: false }) public showFileModal: ModalDirective;
  @ViewChild('ConfirmationModal', { static: false }) public ConfirmationModal: ModalDirective;
  @ViewChild('showtempalateModal', { static: false }) public showtempalateModal: ModalDirective;

  constructor(
    private fileManagementService: FileManagementService,
    public router: Router,
    private encryptDecryptService: EncryptDecryptService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        if (sessionStorage.filemanagement) {
          const Data = JSON.parse(sessionStorage.getItem('filemanagement'));
          let decryptedData = this.encryptDecryptService.decryptData(Data);
          this.selectedTemplateNames = decryptedData[0]['selectedTemplateNames'].length > 0 ? decryptedData[0]['selectedTemplateNames'] : [];
          this.projectName = decryptedData[0]['projectName'] ? decryptedData[0]['projectName'] : '';
          this.selectedBrochureNames = decryptedData[0]['selectedBrochureNames'].length > 0 ? decryptedData[0]['selectedBrochureNames'] : [];
          this.selectedProject = decryptedData[0]['selectedProject'].length > 0 ? decryptedData[0]['selectedProject'] : [];
          this.selectedProjectNames = decryptedData[0]['selectedProjectNames'].length > 0 ? decryptedData[0]['selectedProjectNames'] : [];
          this.isLoadingDocumentFolders = decryptedData[0]['isLoadingDocumentFolders'];
          this.showDataNotFoundMessage = this.selectedProject.length > 0 ? false : true;
          this.showDataNotFound = this.selectedTemplateNames.length > 0 ? false : true;
          this.openProjectFolder = (this.selectedTemplateNames.length > 0 || this.selectedBrochureNames.length > 0 || this.selectedProject.length > 0) ? true : false;
        } else {
          this.GetSelectedProjectsList();
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
  getTemplateDetails = (ProjectName) => {
    this.Brochure = false;
    this.templateDetailsSubscribtion = this.fileManagementService.GetBrochureNameList(this.loggedInuserDetails, ProjectName, this.Brochure).subscribe((response) => {
      if (response && response['data'] && response['data'].length > 0) {
        this.selectedTemplateNames = response['data'];
        this.showDataNotFound = false;
      } else {
        this.selectedTemplateNames = [];
        this.showDataNotFound = true;
        this.DataNotFound = "No Data Found";
      }
    });
  }
  // ***** for session Create ***** //
  sessionCreate() {
    let Data = [];
    Data.push({
      selectedTemplateNames: this.selectedTemplateNames.length > 0 ? this.selectedTemplateNames : [],
      showDataNotFound: this.showDataNotFound,
      projectName: this.projectName,
      openProjectFolder: this.openProjectFolder,
      selectedBrochureNames: this.selectedBrochureNames.length > 0 ? this.selectedBrochureNames : [],
      selectedProject: this.selectedProject.length > 0 ? this.selectedProject : [],
      showDataNotFoundMessage: this.showDataNotFoundMessage,
      DataNotFoundMessage: this.DataNotFoundMessage,
      ContentType: this.ContentType,
      popupHeading: this.popupHeading,
      selectedProjectNames: this.selectedProjectNames.length > 0 ? this.selectedProjectNames : [],
      isLoadingDocumentFolders: this.isLoadingDocumentFolders,
    });
    let encryptedData = this.encryptDecryptService.encryptData(Data);
    sessionStorage.setItem('filemanagement', JSON.stringify(encryptedData));
  }
  openFolder = (ProjectName) => {
    // ***** for open and Close project Folder ***** //
    if (ProjectName) {
      this.projectName = ProjectName;
      this.openProjectFolder = true;
      this.GetAllBrochureName(ProjectName);
      this.getTemplateDetails(ProjectName);
      this.getAllSMSNameList(ProjectName);
    } else {
      this.projectName = "";
      this.openProjectFolder = false;
    }
  }
  GetAllBrochureName = (ProjectName) => {
    //-------Get All Brochure Names-------//
    this.Brochure = true;
    this.allBrochureSubscribtion = this.fileManagementService.GetBrochureNameList(this.loggedInuserDetails, ProjectName, this.Brochure).subscribe((response) => {
      if (response && response['data'] && response['data'][0]) {
        this.selectedBrochureNames = response['data'];
        this.projectName = ProjectName;
        this.showDataNotFound = false;
        this.DataNotFound = '';
        this.sessionCreate();
      } else {
        this.selectedBrochureNames = [];
        this.showDataNotFound = true;
        this.DataNotFound = "No Data Found";
      }
      this.getAllSMSNameList(ProjectName);
      this.getTemplateDetails(ProjectName);
    });
    //-------End-------//
  }
  getAllSMSNameList = (ProjectName) => {
    //-------get all SMS name list for selected project-------//
    if (ProjectName && ProjectName !== '') {
      this.projectNames = ProjectName;
      this.ContentType = 'sms';
      this.allSmsNameSubscribtion = this.fileManagementService.getAllSmsNames(this.loggedInuserDetails, ProjectName, this.brochure, this.ContentType).subscribe((response) => {
        if (response && response['data'].length > 0) {
          this.selectedProject = response['data'].length > 0 ? response['data'] : [];
          this.showDataNotFoundMessage = false;
          this.DataNotFoundMessage = "";
          this.sessionCreate();
        } else {
          this.showDataNotFoundMessage = true;
          this.DataNotFoundMessage = "No Data Found";
        }
      });
    }
    //-------End-------//
  }
  //***** insert New template *****//
  uploadTemplate = () => {
    this.showtempalateModal.show();
    this.ContentType = 'email';
    this.popupHeading = 'Insert Template';
    this.templateUpdate = false;
  }
  // ***** Insert new Brochure *****//
  uploadBrochure = () => {
    this.showFileModal.show();
    this.ContentType = 'brochure';
    this.popupHeading = 'Insert Brochure';
  }
  // ***** Insert New Sms *****//
  uploadSms = () => {
    this.showFileModal.show();
    this.ContentType = 'sms';
    this.popupHeading = 'Insert SMS';
  }

  OnEditBtnClick = (i, item) => {
    //-------Edit the Content As per each index-------//
    this.editedIndex = i;
    this.message = item.Content;
    //-------End-------//
  }

  // ***** For updation of Temaplate *****//
  onUpdateTemplate = (action, selectedTemplate) => {
    this.showtempalateModal.show();
    this.ContentType = 'email';
    this.KeyID = selectedTemplate.ID;
    this.fileManagementModel.TemplateName = selectedTemplate.Key;
    this.fileManagementModel.TemplateModel = selectedTemplate.Content;
    if (action === 'edit') {
      this.popupHeading = 'Update Template';
      this.templateUpdate = true;
      this.disableTemplateFields = false;
    } else {
      this.popupHeading = 'Template Information';
      this.disableTemplateFields = true;
    }
  }

  uploadPdf = (projectName, fileManagementModel, ContentType, uploadPdfFileList, smsBrochureForm) => {
    //-------Upload PDf or Brochure or Email Template or SMS-------//
    fileManagementModel.Module = 'sales';
    let fileUpload = [];
    if (uploadPdfFileList && uploadPdfFileList.length > 0) {
      let fileLength = uploadPdfFileList.length;
      fileUpload.push(uploadPdfFileList[fileLength - 1]);
    }
    this.uploadPdfSubscribtion = this.fileManagementService.InsertPdfFile(projectName, fileManagementModel, ContentType, fileUpload, this.loggedInuserDetails,'Add Template').subscribe((response) => {
      if (response === 'Successful') {
        this.uploadPdfSuccessfullMessage = response;
      } else {
        this.uploadPdfUnsuccessfullMessage = response;
      }
      projectName = "";
      this.ContentType = "";
      this.fileManagementModel =<IfileManagementModel>{};
      smsBrochureForm.form.markAsPristine();
      smsBrochureForm.form.markAsUntouched();
      this.uploadPdfFileList = [];
      setTimeout(() => {
        this.uploadPdfSuccessfullMessage = "";
        this.uploadPdfUnsuccessfullMessage = "";
        this.showtempalateModal.hide();
        this.showFileModal.hide();
        this.GetAllBrochureName(this.projectName);
      }, 5000);
    });
    //-------End-------//
  }
  GetSelectedProjectsList = () => {
    //-------Get All Projects Name Having Brochure or PDF-------//
    this.isLoadingDocumentFolders = true;
    this.selectedProjectListSubscribtion = this.fileManagementService.GetProjectListOnSelected(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedProjectNames = response["data"];
        this.isLoadingDocumentFolders = false;
        this.sessionCreate();
      }
    });
    //-------End-------//
  }
  UpdateSMSTemplate = (isactive, Key_Id, Content) => {
    //-------Update All Projects Name Having Template-------//
    this.smsTemplateSubscribtion = this.fileManagementService.UpdateSMSTemplateContent(this.loggedInuserDetails, Key_Id, Content, isactive).subscribe((response) => {
      if (response['successful']) {
        this.editedIndex = null;
        this.fileManagementModel =<IfileManagementModel>{};
        this.getAllSMSNameList(this.projectNames);
        this.GetAllBrochureName(this.projectNames);
        this.showSuccessfullMessage = "Content Updated Successfully."
      } else {
        this.showNotSuccessfullMessage = "Content Updation Failed."
      }
      setTimeout(() => {
        this.showSuccessfullMessage = '';
        this.showNotSuccessfullMessage = '';
        this.showtempalateModal.hide();
      }, 5000);
    });
    //-------End-------//
  }

  OnClickDeleteButton = (selectedItem, type) => {
    //-------Open Model To Confirm Deletion-------//
    this.fileName = selectedItem.ProjectName;
    this.deleteType = type;
    this.KeyID = type === 'brochure' ? selectedItem.Id : selectedItem.ID;
    this.Content = type === 'sms' ? selectedItem.Content : '';
    this.ConfirmationModal.show();
  }
  //***** for delete Brochure *****//
  brochureDelete = (isactive) => {
    this.fileUrl = this.showPdf + this.fileName;
    this.brochureDeleteSubscribtion = this.fileManagementService.deleteBrochure(this.loggedInuserDetails, this.KeyID, isactive, this.fileUrl).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessfullMessage = "Content Deleted Successfully";
        this.GetAllBrochureName(this.projectNames);
      } else {
        this.showNotSuccessfullMessage = "Content Deletion Failed.";
      }
      setTimeout(() => {
        this.showSuccessfullMessage = '';
        this.showNotSuccessfullMessage = '';
        this.ConfirmationModal.hide();
      }, 5000);
    });
  }
  OnClickConfirmDelete = (isactive) => {
    //-------Delete Selected Template On Click-------//
    this.confirmDeleteSubscribtion = this.fileManagementService.UpdateSMSTemplateContent(this.loggedInuserDetails, this.KeyID, this.Content, isactive).subscribe((response) => {
      if (response['successful']) {
        this.editedIndex = null;
        this.getAllSMSNameList(this.projectNames);
        this.GetAllBrochureName(this.projectNames);
        this.showSuccessfullMessage = "Content Deleted Successfully."
      } else {
        this.showNotSuccessfullMessage = "Content Deletion Failed."
      }
      setTimeout(() => {
        this.showSuccessfullMessage = '';
        this.showNotSuccessfullMessage = '';
        this.ConfirmationModal.hide();
      }, 5000);
    });
    //-------End-------//
  }
  OnClickPreviousButton() {
    //-------To Go back to previous Page-------//
    this.fileManagementModel.TemplateModel = "";
    this.fileManagementModel.TemplateName = "";
    this.editedIndex = null;
    this.openProjectFolder = false;
    this.GetSelectedProjectsList();
    this.sessionCreate();
    //-------End-------//
  }
  clearData(FileManagementForm) {
    FileManagementForm.reset();
    this.selectedTemplateNames = [];
    this.selectedBrochureNames = [];
    this.selectedProjectNames = [];
    this.projectName = '';
    this.selectedProject = [];
    this.openProjectFolder = false;
  }
  onClose = () => {
    this.showtempalateModal.hide();
    this.fileManagementModel =<IfileManagementModel>{};
  }
  close() {
    this.ConfirmationModal.hide()
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.onClose();
      this.close();
      this.closeTemplate();
    }
  }
  closeTemplate = () => {
    this.showFileModal.hide();
    this.GetAllBrochureName(this.projectName);
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
 ngOnDestroy() {
    this.confirmDeleteSubscribtion ? this.confirmDeleteSubscribtion.unsubscribe() : null;
    this.brochureDeleteSubscribtion ? this.brochureDeleteSubscribtion.unsubscribe() : null;
    this.smsTemplateSubscribtion ? this.smsTemplateSubscribtion.unsubscribe() : null;
    this.selectedProjectListSubscribtion ? this.selectedProjectListSubscribtion.unsubscribe() : null;
    this.uploadPdfSubscribtion ? this.uploadPdfSubscribtion.unsubscribe() : null;
    this.allSmsNameSubscribtion ? this.allSmsNameSubscribtion.unsubscribe() : null;
    this.allBrochureSubscribtion ? this.allBrochureSubscribtion.unsubscribe() : null;
    this.templateDetailsSubscribtion ? this.templateDetailsSubscribtion.unsubscribe() : null;
  }
}