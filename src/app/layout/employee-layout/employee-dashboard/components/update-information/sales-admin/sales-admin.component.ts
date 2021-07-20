
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { SalesAdminService } from 'src/app/shared/services/employee/sales-admin.service'
import { ModalDirective } from 'ngx-bootstrap';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';
import { MatSnackBar } from '@angular/material';
import { IUserfilterDataModel, IfilterReferralDataModel, IfilterInvoiceDataModel, IleadData, IrefModel } from 'src/app/shared/models/employeeModel/FilterDetails.model';
import { NgForm } from '@angular/forms';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IUpdateCredentials, Istore, IsearchModel } from 'src/app/shared/models/employeeModel/sales-admin.model';

@Component({
  selector: 'app-sales-admin',
  templateUrl: './sales-admin.component.html',
  styleUrls: ['./sales-admin.component.scss']
})
export class SalesAdminComponent implements OnInit, OnDestroy {
  public showButton: string = '';
  @ViewChild('passwordConfirmationModal', { static: false }) public passwordConfirmationModal: ModalDirective;
  @ViewChild('EmailChangeModal', { static: false }) public EmailChangeModal: ModalDirective;
  @ViewChild('SetCredentials', { static: false }) public SetCredentials: ModalDirective;
  @ViewChild('EOIDisqualifiedModal', { static: false }) public EOIDisqualifiedModal: ModalDirective;

  public referralloading: boolean = false;
  public storeDetails: string[] = [];
  public title: string = '';
  public notFound: boolean;
  public correct: string = '';
  public Loading: boolean;
  public store: Istore = <Istore>{};
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public searchModel: IsearchModel = <IsearchModel>{};
  public UsersData: string[] = [];
  public filterAllCro: string[] = [];
  public UpdateCredentials: IUpdateCredentials = <IUpdateCredentials>{};
  public listreferredChannelPartner: any;
  public storereferredChannelPartner: object = {};
  public storeCPInvoice: string[] = [];
  public CPInvoice: string[] = [];
  public isEmailAvailable: boolean;
  public showemail: string = '';
  public NewReferral: string = '';
  public p2: number;
  public p1: number;
  public p3: number;
  public isLoading: boolean = false;
  public Isloading: boolean = false;
  public filterDataModel: IUserfilterDataModel = <IUserfilterDataModel>{};
  public filterReferralDataModel: IfilterReferralDataModel = <IfilterReferralDataModel>{};
  public filterInvoiceDataModel: IfilterInvoiceDataModel = <IfilterInvoiceDataModel>{};
  public rejectedInvoices: string[] = [];
  public EOIDisqualifiedList: string[] = [];
  public refModel: IrefModel = <IrefModel>{};
  public leadData: IleadData = <IleadData>{};
  public AllCpDetails: string[] = [];
  public AllCroDetails: string[] = [];
  public TempCPDetails: string[] = [];
  public TempCrodetails: string[] = [];
  public AllReferalRequestList: string[] = [];
  public disableSearchlead: boolean = false;
  public AllEmpDetails: string[] = [];;
  public TempEmpdetails: string[] = [];
  public showCreate: boolean = false;

  private _EventSubscription: Array<Subscription> = [];

  public ListOfCROfilter = [
    { item: 'Entityid' },
    { item: 'Name' },
    { item: 'Email' }];
  public ListOfReferralfilter = [
    { item: 'MobileNo' },
    { item: 'Name' },
    { item: 'Email' },
    { item: 'Status' },
    { item: 'VerificationStatus' }];
  public ListOfInvoicefilter = [
    { item: 'OrderId' },
    { item: 'CustomerName' },
    { item: 'BrokerName' },
    { item: 'BrokerMobileNo' },
    { item: 'VerificationStatus' }]
  public UserTypeList = [
    { key: 'ChannelPartner', value: 'ChannelPartner' },
    { key: 'CRO', value: 'CRO' },
    { key: 'Referral', value: 'Referral' }];
  public TypeList = [
    { key: 'ChannelPartner', value: 'ChannelPartner' },
    { key: 'CRO', value: 'CRO' },
    { key: 'Employee', value: 'WalkIn' }];

  constructor(public salesAdminService: SalesAdminService, public signupservice: SignUpService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.searchModel['Stakeholder'] = 'ChannelPartner';
    this.getAllUsersData();
    this.myChannelPartnerReferral();
    this.getCPInvoice();
    this.getEOIList();
    this.getReferalchageRequest();
    this.getAllCpCROList();
  }

  getAllUsersData = () => {
    this.Loading = true;
    let getAllDataSubscribtion = this.salesAdminService.getAllUsers(this.loggedInuserDetails, this.searchModel).subscribe((response) => {
      if (response && response['data'] && response['data'].length > 0) {
        this.filterAllCro = this.UsersData = response['data'];
      } else {
        this.UsersData = [];
      }
      this.Loading = false;
    });
    this._EventSubscription.push(getAllDataSubscribtion);
  }
  check = (UpdateCredentials) => {
    if (UpdateCredentials.confirmNewId) {
      this.correct = UpdateCredentials.NewUserId === UpdateCredentials.confirmNewId ? "Match" : "new and confirm userid must be same";
    }
  }
  //************* filter table popup data **************//
  filterData = () => {
    let counter = 0;
    this.ListOfCROfilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.UsersData : this.filterAllCro;
        this.UsersData = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.UsersData = counter === 0 ? this.filterAllCro : this.UsersData;
  }
  //************* filter table popup data **************//
  filterReferralData() {
    let counter = 0;
    this.ListOfReferralfilter.map(element => {
      if (element && this.filterReferralDataModel[element.item]) {
        let Data = counter > 0 ? this.listreferredChannelPartner : this.storereferredChannelPartner;
        this.listreferredChannelPartner = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterReferralDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.listreferredChannelPartner = counter === 0 ? this.storereferredChannelPartner : this.listreferredChannelPartner;
  }
  filterInvoiceData() {
    let counter = 0;
    this.ListOfInvoicefilter.map(element => {
      if (element && this.filterInvoiceDataModel[element.item]) {
        let Data = counter > 0 ? this.CPInvoice : this.storeCPInvoice;
        this.CPInvoice = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterInvoiceDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.CPInvoice = counter === 0 ? this.storeCPInvoice : this.CPInvoice;
  }

  // Filter
  filterSearch = (item: string, Type) => {
    switch (Type) {
      case 'CP':
        this.AllCpDetails = this.TempCPDetails.filter(x => x['Name'] && x['Name'].toLowerCase().includes(item));
        break;
      case 'CRO':
        this.AllCroDetails = this.TempCrodetails.filter(x => x['CROName'] && x['CROName'].toLowerCase().includes(item));
        break;
      case 'EMP':
        this.AllEmpDetails = this.TempEmpdetails.filter(x => x['Name'] && x['Name'].toLowerCase().includes(item));
        break;
    }
  }

  //************* send password on registered email **************//
  sendPasswordOnEmail(id) {
    let SendPasswordSubscription = this.salesAdminService.sendPassword(this.loggedInuserDetails, id).subscribe((response) => {
      if (response && response['successful']) {
        this.passwordConfirmationModal.hide();
        this.snackBar.open('Password sent successfully on email address', null, { duration: 8000, panelClass: ['blue-snackbar'] });
      } else
        this.snackBar.open('Failed to sent email', null, { duration: 8000, panelClass: ['red-snackbar'] });
    });
    this._EventSubscription.push(SendPasswordSubscription);

  }
  confirmation(Input) {
    switch (Input) {
      case 'yes':
        this.sendPasswordOnEmail(this.store['Id']);
        break;
      case 'no':
        this.Reset(this.SetCredentials);
        this.passwordConfirmationModal.hide();
        break;
    }
  }
  openConfirmation(data, Input, TitleInput) {
    this.showButton = '';
    this.storeDetails = [];
    switch (Input) {
      case 'SendPassword':
        this.store['Id'] = data.Id ? data.Id : null;
        this.store['Email'] = data.Email ? data.Email : null;
        break;
      case 'ApproveRejectReferral':
        this.showButton = TitleInput === 'Approved' ? 'Do you want to approve referral?' : 'Do you want to reject referral?';
        data['NewStatus'] = TitleInput ? TitleInput : null;
        this.storeDetails = data ? data : [];
        this.UpdateCredentials.Remark = "";
        break;
      case 'ApproveRejectInvoice':
        this.showButton = TitleInput === 'Approved' ? 'Do you want to approve invoice?' : 'Do you want to reject invoice?';
        data['NewStatus'] = TitleInput ? TitleInput : null;
        this.storeDetails = data ? data : [];
        break;
    }
    this.title = Input;
    this.passwordConfirmationModal.show();
  }
  //*************Update userId **************//
  UpdateDetails(SetCredentials) {
    this.isLoading = true;
    let UpdateDetailsSubscription = this.salesAdminService.updateUserId(this.loggedInuserDetails, this.UpdateCredentials).subscribe((response) => {
      if (response && response['data'] && response['successful']) {
        if (response["data"][0].Email) {
          this.getAllUsersData();
          this.snackBar.open(response["data"][0].Email + ' ' + 'updated successfully and credential sent to email address', null, { duration: 8000, panelClass: ['blue-snackbar'] });
          this.Reset(SetCredentials);
          this.EmailChangeModal.hide();
        }
      } else
        this.snackBar.open('Failed to update credentials', null, { duration: 5000, panelClass: ['red-snackbar'] });
    });
    this._EventSubscription.push(UpdateDetailsSubscription);
    this.isLoading = false;
  }
  //************* check email duplication **************//
  getEmailValidation = (email) => {
    var emailpattern: any = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$/;
    if (email && emailpattern.test(String(email).toLowerCase())) {
      let emailSubscription = this.signupservice.getEmailValidation(email).subscribe((response) => {
        if (response && response["data"] && response["data"][0]) {
          this.isEmailAvailable = (response["data"][0].IsAvailable === 'Available');
          this.isEmailAvailable ? this.EmailChangeModal.show() : null;
          this.showemail = response["data"][0].IsAvailable;
        }
      });
      this._EventSubscription.push(emailSubscription);
    } else {
      this.showemail = "";
    }
  }
  //************* reset update userid form data **************//
  Reset(SetCredentials) {
    this.UpdateCredentials = <IUpdateCredentials>{};
    this.isEmailAvailable = false;
    this.showemail = '';
    SetCredentials.form.markAsPristine();
    SetCredentials.form.markAsUntouched();
  }
  getDetails(data, Input, SetCredentials: NgForm) {
    SetCredentials.form.markAsPristine();
    SetCredentials.form.markAsUntouched();
    switch (Input) {
      case 'CP':
        this.UpdateCredentials['OldUserId'] = data.Email ? data.Email : null;
        this.UpdateCredentials['Id'] = data.Id ? data.Id : null;
        break;
      case 'CRO':
        this.UpdateCredentials['OldUserId'] = data.Email ? data.Email : null;
        this.UpdateCredentials['Id'] = data.Id ? data.Id : null;
        break;
      case 'Referral':
        this.UpdateCredentials['OldUserId'] = data.ReferralEmail ? data.ReferralEmail : null;
        this.UpdateCredentials['Id'] = data.Id ? data.Id : null;
        break;
    }
    this.UpdateCredentials.confirmNewId = null
    this.UpdateCredentials.NewUserId = null;
    this.correct = '';
    this.EmailChangeModal.show();
  }
  myChannelPartnerReferral() {
    //*********** Channel partners list referred by Channel Partners ***********//
    this.referralloading = true;
    let CPReferralSubscription = this.salesAdminService.ChannelPartnerReferral(this.loggedInuserDetails).subscribe((response) => {
      this.storereferredChannelPartner = this.listreferredChannelPartner = (response && response["data"] && response["data"].length > 0) ? response["data"] : [];
      this.notFound = this.listreferredChannelPartner.length > 0 ? true : false;
      this.referralloading = false;
    });
    this._EventSubscription.push(CPReferralSubscription);
    //*********** End ***********//
  }
  getCPInvoice() {
    //*********** Channel partners list referred by Channel Partners ***********//
    const Cpinvoice = this.salesAdminService.CPInvoiceData(this.loggedInuserDetails, 'CPOrderVerification');
    const AccountsRejected = this.salesAdminService.CPInvoiceData(this.loggedInuserDetails, 'RejectFromAccounting');
    this.Isloading = true;
    let CPInvoiceSubscription = forkJoin([Cpinvoice, AccountsRejected]).subscribe((response) => {
      this.storeCPInvoice = this.CPInvoice = (response && response[0]["data"] && response[0]["data"].length > 0) ? response[0]["data"] : [];
      this.rejectedInvoices = (response && response[1]["data"] && response[1]["data"].length > 0) ? response[1]["data"] : [];
      this.Isloading = false;
    });
    this._EventSubscription.push(CPInvoiceSubscription);
    //*********** End ***********//
  }
  ApproveReject(Referralreject, Input) {
    switch (Input) {
      case 'Referral':
        let ApproveRajectSubscription = this.salesAdminService.ApproveRajectReferral(this.loggedInuserDetails, this.storeDetails, this.UpdateCredentials['Remark']).subscribe((response) => {
          if (response && response['successful'] && response['data'][0].VerificationStatus) {
            this.myChannelPartnerReferral();
            this.snackBar.open(response['data'][0].VerificationStatus + ' ' + 'Successfully', null, { duration: 8000, panelClass: ['blue-snackbar'] });
          } else {
            this.snackBar.open('Failed to approve', null, { duration: 8000, panelClass: ['blue-snackbar'] });
          }
        });
        this._EventSubscription.push(ApproveRajectSubscription);
        break;
      case 'Invoice':
        let ApproveRajectInvoiceSubscription = this.salesAdminService.ApproveRajectInvoice(this.loggedInuserDetails, this.storeDetails, this.UpdateCredentials['InvoiceRemark']).subscribe((response) => {
          if (response && response['successful'] && response['data'][0].VerificationStatus) {
            this.getCPInvoice();
            //this.snackBar.open(response['data'][0].VerificationStatus + ' ' + 'Successfully', null, { duration: 8000, panelClass: ['blue-snackbar'] });
            if (response['data'] && response['data'][0].VerificationStatus === 'Approved') {
              this.insertingeneralVoucher(response['data'][0]);
            } else {
              this.snackBar.open(response['data'][0].VerificationStatus + ' ' + 'Successfully', null, { duration: 8000, panelClass: ['blue-snackbar'] });
            }
          } else {
            this.snackBar.open('Failed to approve', null, { duration: 8000, panelClass: ['blue-snackbar'] });
          }
        });
        this._EventSubscription.push(ApproveRajectInvoiceSubscription);
        break;
    }
    this.passwordConfirmationModal.hide();
    this.UpdateCredentials = <IUpdateCredentials>{};
    Referralreject.form.markAsPristine();
    Referralreject.form.markAsUntouched();
  }

  // ***** After Cp Invoice Approve call this Api for craete General Voucher***** //
  insertingeneralVoucher = (cpDetails) => {
    cpDetails.VoucherType = 'Sales';
    cpDetails.EntityType = 'ChannelPartner';
    let insertintoGeneralVoucherSubscription = this.salesAdminService.insertintoGeneralVoucher(this.loggedInuserDetails, cpDetails).subscribe((response) => {
      if (response && response[0]['Message'] === "Entered Journal Voucher Successfully" && response['successful']) {
        this.snackBar.open('Invoice Approved and Voucher Created Successfully', null, { duration: 8000, panelClass: ['blue-snackbar'] });
      } else {
        this.snackBar.open('Invoice Approved but Vocher Creation Failed', null, { duration: 8000, panelClass: ['blue-snackbar'] });
      }
    })
    this._EventSubscription.push(insertintoGeneralVoucherSubscription);
  }
  // ****** Get EOi Disqualified List ****** //
  getEOIList = () => {
    let DisqualifiedleadEOISubscription = this.salesAdminService.DisqualifiedleadEOI(this.loggedInuserDetails).subscribe(response => {
      this.EOIDisqualifiedList = response && response['data'] ? response['data'] : [];
    })
    this._EventSubscription.push(DisqualifiedleadEOISubscription);
  }
  // ******Open ForEoi Pop Up ****** //
  openApproveEOI = (data) => {
    this.leadData = data;
    this.EOIDisqualifiedModal.show();
  }
  // ****** Confirm EOI Details Form Pop UP ****** //
  ReturnEOI = (amount) => {
    if (amount) {
      let insertEoireturnSubscription = this.salesAdminService.insertEoireturn(this.loggedInuserDetails, this.leadData).subscribe(response => {
        if (response && response['successful'] && response['data'][0]['message'] === 'EOI Return Approved.') {
          this.EOIDisqualifiedModal.hide();
          this.snackBar.open('EOI Return Successfully', null, { duration: 8000, panelClass: ['blue-snackbar'] });
          this.leadData = <IleadData>{};
          this.getEOIList();
        } else {
          this.snackBar.open('EOI Failed to Return ', null, { duration: 8000, panelClass: ['blue-snackbar'] });
        }
      })
      this._EventSubscription.push(insertEoireturnSubscription);
    }
  }

  //------- for receive id from Search -------//
  receiveData = ($event) => {
    this.referralInfoDisplay($event.ReferralId);
    //------- End -------//
  }
  referralInfoDisplay = (referralId) => {
    //------- Referral Information display on Referral Id-------//
    let referralInfoDisplaySubscribtion = this.salesAdminService.getInfoByreferralId(this.loggedInuserDetails, referralId).subscribe((response) => {
      this.refModel = (response && response["data"][0]) ? response["data"][0] : [];
    });
    this._EventSubscription.push(referralInfoDisplaySubscribtion);
    //------- End -------//
  }
  // ***** Get Cp and CRO list  ***** //
  getAllCpCROList = () => {
    const allCpNamesSubscribtion = this.salesAdminService.allCpNames(this.loggedInuserDetails);
    const allCRONamesSubscribtion = this.salesAdminService.allCRONames(this.loggedInuserDetails, 'CRO');
    const allEmpNamesSubscribtion = this.salesAdminService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, 3);
    const apiSub = forkJoin([allCpNamesSubscribtion, allCRONamesSubscribtion, allEmpNamesSubscribtion])
      .subscribe((response) => {
        if (response) {
          this.TempCPDetails = this.AllCpDetails = response[0]['data'];
          this.TempCrodetails = this.AllCroDetails = response[1]['data'];
          this.TempEmpdetails = this.AllEmpDetails = response[2]['data'];
        }
      });
    this._EventSubscription.push(apiSub);
  }

  // ***** Insert / Update Request for referal ***** //
  InsertRequest = (refModel, Status, input) => {
    refModel.Status = Status;
    // refModel.newReferral = refModel.newReferral['BrokerId'] ? refModel.newReferral['BrokerId'] : refModel.newReferral['CROId'];
    // refModel.newReferral = refModel.ReferredType === 'Referral' ? this.loggedInuserDetails['EntityId'] : refModel.newReferral;
    let referedChangeRequestSubscription = this.salesAdminService.referedChangeRequest(this.loggedInuserDetails, refModel, input).subscribe(response => {
      if (response && response['successful']) {
        let msg = Status === 'Submitted' ? 'Referal change request ' + Status + ' and Sent Successfully' : 'Referal change request ' + Status + ' Successfully';
        this.snackBar.open(msg, null, { duration: 8000, panelClass: ['blue-snackbar'] });
        this.getReferalchageRequest();
        this.refModel = <IrefModel>{};
      } else {
        let msg = Status === 'Submitted' ? 'Failed to Submit Request' : 'Failed to Approve Request';
        this.snackBar.open(msg, null, { duration: 5000, panelClass: ['red-snackbar'] });
      }
    });
    this._EventSubscription.push(referedChangeRequestSubscription);
  }
  // ***** Get All Referal change Request ***** //
  getReferalchageRequest = () => {
    let getreferChangeRequestSubscription = this.salesAdminService.getreferChangeRequest(this.loggedInuserDetails).subscribe(response => {
      this.AllReferalRequestList = (response && response['data']) ? response['data'] : [];
    });
    this._EventSubscription.push(getreferChangeRequestSubscription);
  }
  // ****** show selected referral Request ****** //
  selectReferalRequest = (data) => {
    this.refModel = data;
    this.showCreate = true;
    this.refModel['TReferralId'] = data.TReferralId;
    this.refModel['Name'] = data.Leadname;
    this.refModel['ReferredByType'] = data.OldReferralType;
    this.refModel['ReferredBy'] = data.OldReferralName;
    this.refModel['ReferredType'] = data.NewReferralType;
    this.refModel['newReferral'] = data.NewReferralId;
    // this.refModel['newReferral'] = data.NewReferralType === 'ChannelPartner' ?
    //   this.AllCpDetails.filter(x => x['BrokerId'] === data.NewReferralId)[0] :
    //   this.AllCroDetails.filter(x => x['CROId'] === data.NewReferralId)[0];
    this.refModel['ReferredById'] = data.OldReferralId;
  }

  // ****** New of cancel request click ****** //
  newCancelrequest = (type) => {
    this.showCreate = type === 'new' ? true : false;
    this.refModel = <IrefModel>{};
  }

  trackByFn(item) {
    return item.id;
  }
  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}
