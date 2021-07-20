import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/shared/services/employee/order.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';

@Component({
  selector: 'tru-emp-agreement-status',
  templateUrl: './emp-agreement-status.component.html',
  styleUrls: ['./emp-agreement-status.component.scss']
})
export class EmpAgreementStatusComponent implements OnInit {
  @ViewChild('confirmAgeementModal', { static: false }) public confirmAgeementModal: ModalDirective;

  public AgreementStatusList: any = [
    { key: "Not Initiated", value: "Not Initiated" },
    { key: "Initiated - Franking Done", value: "Initiated - Franking Done" },
    { key: "Registration Done", value: "Registration Done" }];
  @Input() orderDetails: any = [];
  public agreementStatusModel: any = {};
  public orderModel: any = {};
  public showAgreementSuccessfullMessage: string = "";
  public showAgreementUnSuccessfullMessage: string = "";
  public isLoadingAgreementSubmitMessage: boolean = false;
  public loggedInuserDetails: any;
  public isDisableOnSearchOrder: boolean = true;
  public isDisableOnCreateOrder: boolean = false;
  public disableFields: boolean = false;
  public preferredBuildingTypeLists: any = [];
  public AllParkingNumbers: any = [];
  public AllParkingNumbersTwo: any = [];
  public disableBtn: boolean = false;
  public disableParking: boolean = false;
  public uploadFileAgreement: FileAttachment[] = [];
  public uploadFileNOC: FileAttachment[] = [];
  public uploadFileParkLocation: FileAttachment[] = [];
  public Mandetory: boolean = false;
  constructor(public router: Router, private orderService: OrderService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.isDisableOnSearchOrder = true;
        this.orderModel.custType = "employee";
      } else {
        this.router.navigate(['/login']);
      }
    }
    this.agreementStatusModel.AgreementStatus = this.agreementStatusModel.AgreementStatus ? this.agreementStatusModel.AgreementStatus : "";
    this.Mandetory = this.disableFields = this.agreementStatusModel.AgreementStatus === 'Registration Done' ? true : false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderDetails && this.orderDetails) {
      if (localStorage.getItem('LoggedinUser')) {
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
        this.orderModel = this.orderDetails;
        this.agreementStatusModel = this.orderDetails;
        this.GetSelectedBuildingTypeList();
        this.agreementStatusModel.ParkingoneBuildingType = this.orderDetails.BuildingType1;
      }
    }
  }
  GetSelectedBuildingTypeList = () => {
    //--------Get All Building Type For Selected Project-------//
    this.orderService.GetBuildingTypeOnSelectedProject(this.loggedInuserDetails, this.orderModel.ProjectName).subscribe((response) => {
      if (response["data"]) {
        this.preferredBuildingTypeLists = response["data"];
      }
    });
  }
  // ParkingDetails List For Building One
  ParkingOnBuilding = (building) => {
    if (building) {
      this.orderService.getAllParkingsonBuilding(this.loggedInuserDetails, this.orderModel.ProjectId, building).subscribe((response) => {
        if (response && response["data"]) {
          this.AllParkingNumbers = response["data"][0];
        }
      });
    }
  }
  // ParkingDetails List For Building Two
  ParkingOnBuildingTwo = (building2) => {
    if (building2) {
      this.orderService.getAllParkingsonBuilding(this.loggedInuserDetails, this.orderModel.ProjectId, building2).subscribe((response) => {
        if (response && response["data"]) {
          this.AllParkingNumbersTwo = response["data"][0];
        }
      });
    }
  }
  // Location For Parking One
  selectedParkingOne = (parkingNoOne) => {
    if (parkingNoOne) {
      this.agreementStatusModel.Location1 = this.AllParkingNumbers.filter(x => x.ParkingId && Number(x.ParkingId) === Number(parkingNoOne))[0].Location;
    }
  }
  // Location For Parking Two
  selectedParkingTwo = (parkingNoTwo) => {
    if (parkingNoTwo) {
      this.agreementStatusModel.Location2 = this.AllParkingNumbersTwo.filter(x => x.ParkingId && Number(x.ParkingId) === Number(parkingNoTwo))[0].Location;
    }
  }
  OnUpdateBtnClick = () => {
    this.isLoadingAgreementSubmitMessage = true;
    this.disableBtn = true;
    this.agreementStatusModel.Remarks = this.agreementStatusModel.newRemarks;
    //Agreement File
    let uploadFile = [], dbUrl = null, deleteUrl = null;
    if (this.uploadFileAgreement.length > 0) {
      let len = this.uploadFileAgreement.length;
      uploadFile.push(this.uploadFileAgreement[len - 1]);
    }
    dbUrl = (this.uploadFileAgreement.length === 0) ? this.orderModel.AgreementFile : null;
    deleteUrl = (this.uploadFileAgreement.length > 0) ? this.orderModel.AgreementFile : null;
    // NOC File
    let nocuploadFile = [], nocdbUrl = null, nocdeleteUrl = null;
    if (this.uploadFileNOC.length > 0) {
      let len = this.uploadFileNOC.length;
      nocuploadFile.push(this.uploadFileNOC[len - 1]);
    }
    nocdbUrl = (this.uploadFileNOC.length === 0) ? this.orderModel.NOCFile : null;
    nocdeleteUrl = (this.uploadFileNOC.length > 0) ? this.orderModel.NOCFile : null;

    // Park Location File
    let parkuploadFile = [], parkdbUrl = null, parkdeleteUrl = null;
    if (this.uploadFileParkLocation.length > 0) {
      let len = this.uploadFileParkLocation.length;
      parkuploadFile.push(this.uploadFileParkLocation[len - 1]);
    }
    parkdbUrl = (this.uploadFileParkLocation.length === 0) ? this.orderModel.ParkingFile : null;
    parkdeleteUrl = (this.uploadFileParkLocation.length > 0) ? this.orderModel.ParkingFile : null;
    this.orderService.UpdateAgreementStatus(this.agreementStatusModel, this.orderModel, this.loggedInuserDetails, uploadFile, deleteUrl, dbUrl, nocuploadFile, nocdeleteUrl, nocdbUrl, parkuploadFile, parkdeleteUrl, parkdbUrl).subscribe((response) => {
      if (response && response['successful'] && response['data']) {
        this.showAgreementSuccessfullMessage = "Agreement Status Updated Successfully.";
        this.orderModel.AgreementFile = (response['data'][0] && response['data'][0].AgreementFile) ? response['data'][0].AgreementFile : null;
        this.orderModel.NOCFile = (response['data'][0] && response['data'][0].NOCFile) ? response['data'][0].NOCFile : null;
        this.orderModel.ParkingFile  = (response['data'][0] && response['data'][0].ParkingFile) ? response['data'][0].ParkingFile : null;
        this.agreementStatusModel.Remarks = (response['data'][0] && response['data'][0].Remarks) ? response['data'][0].Remarks : null;
        this.agreementStatusModel.newRemarks = '';
        this.uploadFileAgreement = [];
        this.uploadFileNOC = [];
        this.uploadFileParkLocation = [];
        this.disableFields = this.agreementStatusModel.AgreementDate !== null || this.agreementStatusModel.RegistrationNo !== null ? true : false;
      } else {
        this.showAgreementUnSuccessfullMessage = "Agreement Status Updation Failed.";
      }
      setTimeout(() => {
        this.showAgreementSuccessfullMessage = '';
        this.showAgreementUnSuccessfullMessage = '';
      }, 5000);
      this.isLoadingAgreementSubmitMessage = false;
    });
  }
  //****** Open Agreement File ******//
  OpenFile = (url) => {
    window.open(url);
  }
  onChangeAgreementStatus = (Type: string) => {
    this.Mandetory = (Type === 'Registration Done') ? true : false;
  }

  // clearAgreementAccordion = (AgreementStatusForm) => {
  //   this.agreementStatusModel = {};
  //   AgreementStatusForm.form.markAsPristine();
  //   AgreementStatusForm.form.markAsUntouched();
  // }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
}
