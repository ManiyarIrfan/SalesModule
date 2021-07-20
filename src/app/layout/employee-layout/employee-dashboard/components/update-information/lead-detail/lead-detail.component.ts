import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";
import { Subscription, forkJoin } from "rxjs";
import { SharedService } from "src/app/shared/services/shared/shared.service";
import { PreSalesleadDetailsService } from "src/app/shared/services/employee/pre-saleslead-details.service";
import { MatSnackBar } from "@angular/material";
import { IloggedInuserDetails } from "src/app/shared/models/Authentication/loggedInuserDetails.model";
import {
  IleadinfoDetails,
  IselectedEmployeeName,
  IcallCheckList,
  IupdateRemark,
  IinteractionModel,
  IleadSiteInfo,
} from "src/app/shared/models/employeeModel/lead-detail.model";
import { endWith } from "rxjs/operators";

@Component({
  selector: "tru-lead-detail",
  templateUrl: "./lead-detail.component.html",
  styleUrls: ["./lead-detail.component.scss"],
})
export class LeadDetailComponent implements OnChanges, OnInit, OnDestroy {
  public StatusInfo: any = [
    { key: "incoming", value: "Incoming" },
    { key: "prospect", value: "Prospect" },
    { key: "warm", value: "Warm" },
    { key: "hot", value: "Hot" },
    { key: "cold", value: "Cold / Not Responding" },
    { key: "unqualified", value: "Unqualified" },
    { key: "lost", value: "Lost" },
  ];
  public propertyTypeInfo: any = [
    { key: "Studio", value: "Studio" },
    { key: "Villa", value: "Villa" },
    { key: "Apartment", value: "Apartment" },
    { key: "Penthouse", value: "Penthouse" },
    { key: "Bunglow", value: "Bunglow" },
    { key: "Plots", value: "Plots" },
    { key: "Duplex", value: "Duplex" },
    { key: "Shop", value: "Shop" },
    { key: "Office", value: "Office" },
    { key: "Rowhouse", value: "Rowhouse" },
    { key: "Townhouse", value: "Townhouse" },
    { key: "IT Park", value: "IT Park" },
  ];
  public BudgetInfo: any = [
    { key: "0 to 25", value: "0 to 25" },
    { key: "25 to 35", value: "25 to 35" },
    { key: "35 to 45", value: "35 to 45" },
    { key: "45 to 55", value: "45 to 55" },
    { key: "55 to 65", value: "55 to 65" },
    { key: "65 to 75", value: "65 to 75" },
    { key: "75 to 85", value: "75 to 85" },
    { key: "85 to 95", value: "85 to 95" },
    { key: "95 to More than 100", value: "95 to More than 100" },
  ];
  public lostStatusInfo: any = [
    { key: "Booked with competitor", value: "Booked with competitor" },
    {
      key: "Invalid Customer Contact Number",
      value: "Invalid Customer Contact Number",
    },
    { key: "Dropped the plan", value: "Dropped the plan" },
  ];
  public coldStatusInfo: any = [
    { key: "Loan Issues", value: "Loan Issues" },
    { key: "Budget issues", value: "Budget issues" },
    {
      key: "Customer Postponed property buying",
      value: "Customer Postponed property buying",
    },
    {
      key: "Requirement for lower floors",
      value: "Requirement for lower floors",
    },
    { key: "Location issue", value: "Location issue" },
    { key: "Apartment size issue", value: "Apartment size issue" },
    { key: "Possession mismatch", value: "Possession mismatch" },
    {
      key: "Will visit as per Convenience",
      value: "Will visit as per Convenience",
    },
    {
      key: "Looking for smaller apartment",
      value: "Looking for smaller apartment",
    },
    { key: "Looking for Plot", value: "Looking for Plot" },
    {
      key: "Looking for larger apartment",
      value: "Looking for larger apartment",
    },
  ];
  public unqualifiedStatusInfo: any = [
    { key: "No Followup", value: "No Followup" },
    { key: "Not Interested", value: "Not Interested" },
    { key: "Duplicate Customer", value: "Duplicate Customer" },
    { key: "Looking for Commercial", value: "Looking for Commercial" },
    { key: "Looking for Plot", value: "Looking for Plot" },
    { key: "Not looking property", value: "Not looking property" },
    { key: "Dropped the plan", value: "Dropped the plan" },
    { key: "Not answering / Responding", value: "Not answering / Responding" },
    { key: "Is a Channel Partner", value: "Is a Channel Partner" },
    {
      key: "Customer already booked property in past with us",
      value: "Customer already booked property in past with us",
    },
  ];
  public warmStatusInfo: any = [
    {
      key: "Had long discussion on call",
      value: "Had long discussion on call",
    },
    { key: "Interested in Sitevisit", value: "Interested in Sitevisit" },
    { key: "Second Sitevisit", value: "Second Sitevisit" },
    {
      key: "Spend long time during Sitevisit",
      value: "Spend long time during Sitevisit",
    },
    {
      key: "Matches customer requirements",
      value: "Matches customer requirements",
    },
    {
      key: "Matches customer Preferred location",
      value: "Matches customer Preferred location",
    },
    { key: "Multiple incoming calls", value: "Multiple incoming calls" },
  ];
  public possesionStatusInfo: any = [
    { key: "Immediate", value: "Immediate" },
    { key: "1 Month", value: "1 Month" },
    { key: "2 Month", value: "2 Month" },
    { key: "6 Month", value: "6 Month" },
    { key: "1 Year", value: "1 Year" },
    { key: "2 Year", value: "2 Year" },
    { key: "3 Year", value: "3 Year" },
    { key: "4 Year", value: "4 Year" },
    { key: "Not Concern", value: "Not Concern" },
    { key: "Under Construction", value: "Under Construction" },
  ];
  public fundingSourceInfo: any = [
    { key: "Sell", value: "Sell" },
    { key: "Homeloan", value: "Homeloan" },
  ];
  public bhkInfo: any = [
    { key: "1Rk", value: "1 Rk" },
    { key: "1BHK", value: "1 BHK" },
    { key: "1.5BHK", value: "1.5 BHK" },
    { key: "2BHK", value: "2 BHK" },
    { key: "2.5BHK", value: "2.5 BHK" },
    { key: "3BHK", value: "3 BHK" },
    { key: "3.5BHK", value: "3.5 BHK" },
    { key: "4BHK", value: "4 BHK" },
    { key: "4.5BHK", value: "4.5 BHK" },
    { key: "5BHK", value: "5 BHK" },
    { key: "5.5BHK", value: "5.5 BHK" },
    { key: "6BHK", value: "6 BHK" },
    { key: "7BHK", value: "7 BHK" },
  ];
  public purposeInfo: any = [
    { key: "End User", value: "End User" },
    { key: "Investor", value: "Investor" },
  ];
  public showemail: number;
  public radiobtn: any = [
    "SubTag",
    "SubTag1",
    "SubTag2",
    "SubTag3",
    "SubTag4",
    "SubTag5",
    "SubTag6",
    "SubTag7",
    "SubTag8",
    "SubTag9",
    "SubTag10",
    "SubTag11",
    "SubTag12",
    "SubTag13",
    "SubTag14",
    "SubTag15",
    "SubTag16",
    "SubTag17",
    "SubTag18",
    "SubTag19",
    "SubTag20",
    "SubTag21",
    "SubTag22",
    "SubTag23",
  ];

  //For radio button
  public booleanStatus = [
    { key: "Yes", value: true },
    { key: "No", value: false }];

  //For call rating pop up
  public result: number;
  public ErrorMessage: string = '';
  public isSpinner: boolean = false;
  public CallId: string;
  public RatingModel: any = [];
  public finalDetails: any = [];
  public sourceInfo: string[] = [];
  public isLoading: boolean = false;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public leadinfoDetails: IleadinfoDetails = <IleadinfoDetails>{};
  public showLeadGenerate: boolean = false;
  public isEditFields: boolean = false;
  public isEmailEdit: boolean = false;
  public stremail: any;
  public stageReason: string;
  public stageStatus: string;
  public remarkUpdate: String;
  public updateRemark: IupdateRemark = <IupdateRemark>{};
  public projectNames: object[] = [];
  public selectedEmployeeName: IselectedEmployeeName[] = [];
  public Role: number = 5;
  public statusHistory: string;
  public arrString: string[] = [];
  public updateModel: string;
  public disableAllFields: boolean = false;
  public showAfterReceivedData: boolean = false;
  public status: string;
  public currentPresales: string;
  public prevPresales: string;
  public interaction: string[] = [];
  public interactiontype: string;
  public allEnquiryId: string[] = [];
  public currentIndexNo: number;
  public indexLength: number;
  public salesDisableAllFields: boolean = false;
  public isEditPresalesFields: boolean = false;
  //public disableNameFields:boolean=false;
  public reCampaign: string[] = [];
  public reSubSource: string[] = [];
  public reSource: string[] = [];
  public enableUpdateName: boolean = false;
  public leadInfo: string[] = [];
  public interactionModel: IinteractionModel = <IinteractionModel>{};
  public interactionDetails: string;
  public selectedList: string[] = [];
  public callCheckList: IcallCheckList[] = [];
  public leadSiteInfo: IleadSiteInfo = <IleadSiteInfo>{};
  public Remark: string;
  public showmobile: number;

  private _EventSubscription: Array<Subscription> = [];
  public invalidEmail: string = "";
  public Email: string = "";
  public callObservationList: object[] = [];
  @Input() id: any; // get EnquiryId for display data
  @Output() emitEvent = new EventEmitter<any>(); // used for lead Generation data send
  @ViewChild("updateEnquiryStatusModal", { static: false })
  public updateEnquiryStatusModal: ModalDirective;
  // @ViewChild('confirmationModelPopup', { static: false }) public confirmationModelPopup: ModalDirective;
  @ViewChild("showOnCallNotesPopup", { static: false })
  @ViewChild('callRatingPopup', { static: false }) public callRatingPopup: ModalDirective;
  public showOnCallNotesPopup: ModalDirective;
  Prevstatus: string;

  constructor(
    private sharedService: SharedService,
    public router: Router,
    private preSalesleadDetailsService: PreSalesleadDetailsService,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem("LoggedinUser"));
    this.leadinfoDetails.EnquiryStatus = "";
    this.leadinfoDetails.Budget = "";
    this.leadinfoDetails.ReportingTo = "";
    this.leadinfoDetails.isEditPreSalesFields = true;
    this.callObservationData();
    this.dataOnLoad();
  }
  dataOnLoad = () => {
    //************* get All Project Name **************//
    const projectNameSub = this.preSalesleadDetailsService.getAllProjectNames(
      this.loggedInuserDetails
    );
    const selectedEmpListSub = this.preSalesleadDetailsService.GetAllEmployeesNamesOnSelected(
      this.loggedInuserDetails,
      this.Role
    );
    const sourceCampaignSub = this.preSalesleadDetailsService.getSourceCampaign(
      this.loggedInuserDetails,
      "Source"
    );

    const forkJoinSub = forkJoin([
      projectNameSub,
      selectedEmpListSub,
      sourceCampaignSub,
    ]).subscribe((response) => {
      if (response) {
        this.projectNames =
          response && response[0]["data"] ? response[0]["data"] : [];

        //************* Get All Presale Employee Name List **************//
        this.selectedEmployeeName =
          response && response[1]["data"] ? response[1]["data"] : [];

        this.sourceInfo =
          response && response[2]["data"] ? response[2]["data"] : [];
      }
    });
    this._EventSubscription.push(forkJoinSub);
  };

  ngOnChanges(changes: SimpleChanges) {
    //************* if input id changes then get details of that id **************//
    if ((changes.id && this.id) || this.id != undefined) {
      this.CallId = changes.id.currentValue.CallId ? changes.id.currentValue.CallId : null;
      (this.CallId != null && this.CallId != '') ? (this.getMasterCallRatingDetails('GetAll')) : null;
      this.id = changes.id.currentValue.id;
      this.allEnquiryId = changes.id.currentValue.enqId;
      if (this.allEnquiryId !== undefined) {
        this.indexLength = this.allEnquiryId.length - 1;
        this.currentIndexNo = this.allEnquiryId.indexOf(this.id);
      }
      this.loggedInuserDetails = JSON.parse(
        localStorage.getItem("LoggedinUser")
      );
      this.getEnquiryDetails();
      this.disableAllFields = false;
      this.showAfterReceivedData = false;
    } else {
      this.disableAllFields = true;
      this.showAfterReceivedData = true;
    }
    this.leadinfoDetails.PresalesAgentAssigned = null;
    //************* end **************//
  }

  nextEnquiryId = () => {
    this.enableUpdateName = this.isEditFields = false;
    //************* get next enquiry id and get details of that id **************//   
    if (this.currentIndexNo != -1) {
      this.currentIndexNo += 1;
      if (this.currentIndexNo <= this.indexLength) {
        this.id = this.allEnquiryId[this.currentIndexNo];
        this.enableUpdateName = false;
      } else {
        this.currentIndexNo = 0;
        this.id = this.allEnquiryId && this.allEnquiryId[this.currentIndexNo];
      }
      this.showemail = 0;
      this.showmobile = 0;
      this.invalidEmail = "";
      this.Email = "";
      this.getEnquiryDetails();
    }
    //************* end **************//
  };
  preEnquiryId = () => {
    this.enableUpdateName = this.isEditFields = false;
    //************* get previous enquiry id and get details of that id **************//
    if (this.currentIndexNo != -1) {
      this.currentIndexNo -= 1;
      if (this.currentIndexNo > -1) {
        this.id = this.allEnquiryId[this.currentIndexNo];
        this.enableUpdateName = false;
      } else {
        this.currentIndexNo = this.indexLength;
        this.id = this.allEnquiryId && this.allEnquiryId[this.currentIndexNo];
      }
      this.showemail = 0;
      this.showmobile = 0;
      this.invalidEmail = "";
      this.Email = "";
      this.getEnquiryDetails();
    }
    //************* end **************//
  };
  close = () => {
    this.showOnCallNotesPopup.hide();
  };

  @HostListener("document:keyup", ["$event"]) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.close();
    }
  }
  receiveMessage($event) {
    //************* after sitevisit get updated data again **************//
    this.id = $event;
    this.getEnquiryDetails();
    //************* End **************//
  }
  //*******show Call Pop up ********/
  callPopUpShow = ($event) => {
    if ($event === true) this.showOnCallNotesPopup.show();
    this.callObservationList = [];
  };
  //************* Get Enquiry Details By Id **************//
  getEnquiryDetails = () => {
    const enquiryDetailsSub = this.preSalesleadDetailsService
      .getByEnquiryLead(this.loggedInuserDetails, this.id)
      .subscribe((response) => {
        if (response && response["data"] && response["data"][0][0]) {
          this.leadinfoDetails = response["data"][0][0];
          this.leadinfoDetails.IsNRI = this.leadinfoDetails["NRI"];
          this.leadinfoDetails.CountryCode = this.leadinfoDetails["CountryCode"];
          this.leadinfoDetails["MobileNoforWA"] = this.leadinfoDetails["MobileNo"];
          this.leadinfoDetails["MobileNo"] = this.leadinfoDetails["MobileNo"] && this.leadinfoDetails["MobileNo"] !== "" && this.loggedInuserDetails.Role === 5 && this.leadinfoDetails["PresalesAgentAssigned"] !== this.loggedInuserDetails.EntityId ? this.leadinfoDetails["MobileNo"].replace(/\d(?=\d{4})/g, "X") : this.leadinfoDetails["MobileNo"];
          this.leadinfoDetails["AlternateNo"] =
            this.leadinfoDetails["AlternateNo"] &&
              this.leadinfoDetails["AlternateNo"] !== "" &&
              (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 11) &&
              this.leadinfoDetails["PresalesAgentAssigned"] !==
              this.loggedInuserDetails.EntityId
              ? this.leadinfoDetails["AlternateNo"].replace(/\d(?=\d{4})/g, "X")
              : this.leadinfoDetails["AlternateNo"];
          this.leadInfo = response["data"];
          this.leadSiteInfo = response["data"][1][0];
          this.reSource =
            this.leadinfoDetails.ReengagedSource !== null
              ? this.leadinfoDetails.ReengagedSource.split(",")
              : [];
          this.reSubSource =
            this.leadinfoDetails.ReengagedSubSource !== null
              ? this.leadinfoDetails.ReengagedSubSource.split(",")
              : [];
          this.reCampaign =
            this.leadinfoDetails.ReengagedCampaign !== null
              ? this.leadinfoDetails.ReengagedCampaign.split(",")
              : [];
          this.stageReason = this.leadinfoDetails.StatusChangeReason;
          this.statusHistory = this.leadinfoDetails.EnquiryStatus;
          this.prevPresales = this.leadinfoDetails["PresalesAgentAssigned"];
          //   if(this.prevPresales == "0" || this.prevPresales == null)
          //  {
          //        this.disableNameFields =true;
          //  }
          //************** When Appended Status Status Come **************//
          this.arrString = this.statusHistory.split("#**#");
          this.leadinfoDetails.EnquiryStatus = this.arrString[
            this.arrString.length - 1
          ];
          this.stageStatus = this.leadinfoDetails.EnquiryStatus;
          this.leadinfoDetails.EnquiryStatus = this.stageStatus.toLowerCase();
          this.status = this.leadinfoDetails.EnquiryStatus;

          // this.disableNameFields = (this.leadinfoDetails.PresalesAgentAssigned === this.loggedInuserDetails.EntityId || this.loggedInuserDetails.Role === 1) ? false : true;
          this.salesDisableAllFields =
            this.leadinfoDetails.PresalesAgentAssigned ===
              this.loggedInuserDetails.EntityId ||
              (this.loggedInuserDetails.TenantId === 0 &&
                this.loggedInuserDetails["EngagementType"] === "Full Time") ||
              this.loggedInuserDetails.Role === 1 ||
              this.loggedInuserDetails.Role === 11
              ? false
              : true;
          this.updateRemark = <IupdateRemark>{};
          this.callObservationData();
        }
      });
    this._EventSubscription.push(enquiryDetailsSub);
    //************* End **************//
  };
  getMobileValidation = (mobile) => {
    var mobilepattern: any = /^\d{10}$/;
    if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
      const mobileValidationSub = this.preSalesleadDetailsService
        .userOnMobile(this.loggedInuserDetails, mobile)
        .subscribe((response) => {
          if (response && response["data"]) {
            this.showmobile = response["data"][0].length;
          }
        });
      this._EventSubscription.push(mobileValidationSub);
    } else {
      this.showmobile = 0;
    }
  };


  updateLeadDetails = (updateModel, updateRemark) => {
    //************* update Lead Details and Remark **************//
    // console.log(this.arrString);    
    this.Prevstatus = this.arrString[this.arrString.length - 1];
    this.remarkUpdate = updateRemark.Remark ? updateRemark.Remark : "";
    if ((updateModel.EnquiryStatus === "incoming" || updateModel.EnquiryStatus === "prospect" || updateModel.EnquiryStatus === "hot")) {
      updateModel.StatusChangeReason = "";
    }
    if ((updateModel.EnquiryStatus === "cold" || updateModel.EnquiryStatus === "hot") && this.leadinfoDetails.EnquiryStatus !== this.Prevstatus) {
      this.interaction["Details"] = ` Status has been Changed from ${this.Prevstatus} To ${updateModel.EnquiryStatus} and Reason is  ${updateModel.StatusChangeReason} ${this.remarkUpdate != "" ? " And Remark is: " + this.remarkUpdate + "." : ""}`;
    }

    if ((updateModel.EnquiryStatus !== "cold" && updateModel.EnquiryStatus !== "hot") && this.leadinfoDetails.EnquiryStatus !== this.Prevstatus) {
      this.interaction["Details"] = `Status has been Changed from  ${this.Prevstatus} To ${updateModel.EnquiryStatus} ${updateModel.StatusChangeReason && updateModel.StatusChangeReason !== "" ? "and Reason is " + updateModel.StatusChangeReason + "." : ""}  
     For Project Name: ${updateModel.PreferredProject}`;
    }

    //************* if Presales is Reassign execute this code **************//
    if (updateModel.PresalesAgentAssigned !== this.prevPresales) {
      this.currentPresales = this.selectedEmployeeName.filter(
        (x) => x.EmployeeId === parseInt(updateModel.PresalesAgentAssigned)
      )[0].Name; //filter name of Current PreSales agent from Json
      this.prevPresales = this.selectedEmployeeName.find(
        (x) => x.EmployeeId === parseInt(this.prevPresales)
      )
        ? this.selectedEmployeeName.find(
          (x) => x.EmployeeId === parseInt(this.prevPresales)
        ).Name
        : "";
      this.interaction["Details"] =
        "Pre-Sales Agent changed from " +
        this.prevPresales +
        " to " +
        this.currentPresales +
        "."; //Insert Interaction after presales Agent Change
      this.interactiontype = "PreSales Reassign";
    }
    //************* End **************//

    this.updateModel = `${this.stageStatus}#**#${updateModel["EnquiryStatus"]}`;
    updateModel.EnquiryStatus = this.updateModel;
    const updateLeadDetailsSub = this.preSalesleadDetailsService
      .updateStatus(this.loggedInuserDetails, updateModel, this.remarkUpdate)
      .subscribe((response) => {
        if (response && response["successful"]) {
          this.showSuccessBar("Record Updated Successfully.");
          this.isEditFields = false;
          this.isEmailEdit = false;
          if (this.interaction["Details"]) {
            this.createInteraction(this.interaction);
          }
          this.interaction = [];
        } else {
          this.showFailedBar("Record Not Updated Successfully.");
        }
        this.updateEnquiryStatusModal.hide();
        this.getEnquiryDetails();
        this.remarkUpdate = "";
      });
    this._EventSubscription.push(updateLeadDetailsSub);
    //************* End **************//
  };
  updateEnquiryName = () => {
    this.enableUpdateName = true;
    let stremail = this.leadinfoDetails.Email;
    var str = "@trurealty.in";
    if (stremail !== "" && stremail !== null) {
      this.isEmailEdit = stremail.endsWith(str);
    }
    if ((this.leadinfoDetails.PresalesAgentAssigned === null && this.loggedInuserDetails.Role === 11 && this.loggedInuserDetails.Level === "L1") || this.leadinfoDetails.PresalesAgentAssigned === this.loggedInuserDetails.EntityId) {
      this.isEditPresalesFields = true;
    } else {
      this.isEditPresalesFields = false;
    }
    this.isEditFields = true;
  };
  createInteraction = (interaction) => {
    //************* if Presales is Reassign execute this code **************//
    interaction.interactionType =
      this.interactiontype === "PreSales Reassign"
        ? "PreSales Reassign"
        : "Note";
    const createInteractionSub = this.preSalesleadDetailsService
      .insertInteractionStatus(
        this.loggedInuserDetails,
        interaction,
        this.leadinfoDetails
      )
      .subscribe((response) => {
        if (response && response["successful"]) {
        }
        this.interactiontype = "";
      });
    this._EventSubscription.push(createInteractionSub);
    //************* End **************//
  };
  onChangeStatus = (status) => {
    //************* on Status Change **************//
    switch (status) {
      case "hot":
        this.updateEnquiryStatusModal.show();
        break;
      case "incoming":
      case "prospect":
      case "":
        this.isEditFields = true;
        break;
      default:
        this.leadinfoDetails.StatusChangeReason = "";
        this.showLeadGenerate = false;
        this.updateEnquiryStatusModal.show();
        break;
    }
    //************* End **************//
  };
  // generateOpportunity = (leadDetails) => {
  //   //************* for Tab Switch to Opportunity **************//
  //   this.emitEvent.emit(leadDetails);
  //   this.sharedService.shareLeadDetailsToGenerate('tab3');
  //   //************* End **************//
  // }
  receiveData = ($event) => {
    // ************** for receive id from Search *************//
    this.id = $event.EnquiryId;
    this.getEnquiryDetails();

    this.disableAllFields =
      $event.PresalesAgentAssigned === this.loggedInuserDetails["EntityId"] ||
        this.loggedInuserDetails.Role === 1
        ? false
        : true;
    this.showAfterReceivedData = false;
    //************* End **************//
  };
  onClose = () => {
    //************* onClose Model **************//
    this.updateEnquiryStatusModal.hide();
    this.leadinfoDetails.EnquiryStatus = this.status;
    this.leadinfoDetails.StatusChangeReason = this.stageReason;
    //************* End **************//
  };
  //**** checklIst of Call Observation *****//
  callObservationData = () => {
    const callObservationSub = this.preSalesleadDetailsService
      .callObservation(this.loggedInuserDetails, this.leadinfoDetails)
      .subscribe((response) => {
        if (response && response["data"] && response["data"].length > 0) {
          this.callCheckList = [];
          this.callCheckList = response["data"];
          this.callCheckList.map((element) => {
            let splitList = element["SubTag"].split(",");
            let ArrayList = [];
            splitList.map((item) => {
              ArrayList.push({ key: item, label: item });
            });
            element["ArrayList"] = ArrayList;
            element["Selected"] = element["Answer"]
              ? splitList.length > 2
                ? { key: element["Answer"], label: element["Answer"] }
                : element["Answer"]
              : null;
          });
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      });
    this._EventSubscription.push(callObservationSub);
  };
  getEmailValidation = (email, type) => {
    var emailPattern: any = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email) {
      if (emailPattern.test(email)) {
        const emailValidationSub = this.preSalesleadDetailsService
          .emailValidation(this.loggedInuserDetails, email)
          .subscribe((response) => {
            if (response && response["data"]) {
              this.showemail = response["data"][0].length;
              if (this.showemail > 0) {
                if (type === "Email") {
                  this.Email = "Email already Exist";
                } else {
                  this.invalidEmail = "Email already Exist";
                }
              } else {
                this.Email = "";
                this.invalidEmail = "";
                this.showemail = 0;
              }
            }
            this.showemail = 0;
          });

        this._EventSubscription.push(emailValidationSub);
      } else {
        this.invalidEmail = "Invalid EmailId";
        this.Email = "Invalid Email";
        this.showemail = 0;
      }
    } else {
      //this.showemail = 0;
      if (type === "Email") {
        this.Email = "Invalid Email Id";
      } else {
        this.invalidEmail = "Invalid Email Id";
      }
    }
  };

  //******* For Interaction submit in call status *********/
  onInteractionSubmit = (
    interactionModel,
    leadStatus,
    updateRemark,
    callInteractionForm
  ) => {
    let intractionDetails = [];
    this.callObservationList.map((element) => {
      let string = element["name"] + ":-" + element["tag"];
      intractionDetails.push(string);
    });
    let selectedRadioButtons = intractionDetails.join(",");
    interactionModel.Details =
      "Call Interaction Note :" +
      interactionModel.Details +
      " And Selected Check List are:" +
      selectedRadioButtons;
    const interactionSubmitSub = this.preSalesleadDetailsService
      .insertInteractionStatus(
        this.loggedInuserDetails,
        interactionModel,
        this.leadinfoDetails
      )
      .subscribe((response) => {
        if (response && response["successful"]) {
          this.showSuccessBar("Interaction Inserted Successfully");
          this.sharedService.sharePresalesIneractionDetails(
            this.interactionDetails
          );
          this.callObservationData();
        } else {
          this.showFailedBar("Interaction Not Inserted Successfully");
        }
        this.interactionModel = <IinteractionModel>{};
        callInteractionForm.form.markAsPristine();
        callInteractionForm.form.markAsUntouched();
      });
    this._EventSubscription.push(interactionSubmitSub);
    if (leadStatus.EnquiryStatus !== this.leadinfoDetails.EnquiryStatus) {
      this.updateLeadDetails(this.leadinfoDetails, updateRemark);
    }
  };
  editDetails = () => {
    //************* For Enable Edit Details **************//
    this.isEditFields = true;
    //************* End **************//
  };
  getReportingId = (presalesEmployee) => {
    this.leadinfoDetails.PresalesAgentAssigned = presalesEmployee;
  };
  // confirmModelPopup = (leadinfoDetails) => {
  //   //************* Confirmation Pop up Show **************//
  //   this.confirmationModelPopup.show();
  //   //************* End **************//
  // }
  selectedChecklist = (event, checkList) => {
    //************* Selected Checkbox will store in Variable *************//
    if (event) {
      this.selectedList.push(checkList);
    } else {
      let index = this.selectedList.indexOf(checkList);
      if (index !== -1) {
        this.selectedList.splice(index, 1);
      }
    }
    //************* End *************//
  };
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  onChange = (string, checkList, index, status) => {
    let tagName = status === "radio" ? string : string;
    this.callCheckList[index]["Selected"] = checkList["Selected"] = string;
    let indexNo = this.callObservationList.findIndex(
      (x) => Number(x["key"]) === Number(checkList.TagId)
    );
    if (indexNo !== -1) {
      this.callObservationList[indexNo]["tag"] = tagName;
    } else {
      this.callObservationList.push({
        key: checkList.TagId,
        name: checkList.Tag,
        tag: tagName,
      });
    }
  };
  callObservationTransaction = () => {
    const callObservationTransactionSub = this.preSalesleadDetailsService
      .callObservationTransaction(
        this.loggedInuserDetails,
        this.id,
        this.callObservationList
      )
      .subscribe((response) => {
        if (response) {
          this.snackBar.open("Interaction Inserted Successfully", null, {
            duration: 5000,
            panelClass: ["blue-snackbar"],
          });
        } else {
          this.snackBar.open("failed To Submit", null, {
            duration: 7000,
            panelClass: ["red-snackbar"],
          });
        }
        this.showOnCallNotesPopup.hide();
      });
    this._EventSubscription.push(callObservationTransactionSub);
  };

  //-----validation check for rating-----//
  validation = (data) => {
    data.rating = data.rating ? data.rating : null;
    if (data.rating > data.Points) {
      this.result = data.CRSubMasterId;
      this.ErrorMessage = "Point exceeds than score";
    }
    else {
      this.ErrorMessage = "";
    }
  }

  getMasterCallRatingDetails = (Input) => {
    const GetMastercallRating = this.preSalesleadDetailsService.getMasterData(this.loggedInuserDetails, Input, this.RatingModel['CallId']).subscribe((response) => {
      if (Input === 'GetAll') {
        if (response && response['data'] && response['data'] && response['data'].length > 0) {
          let test1 = response["data"].map(data => data.CRMasterId).filter((x, i, a) => x && a.indexOf(x) === i);
          this.finalDetails = [];
          this.finalDetails = test1.map((crmId) => {
            let name = response["data"].filter(x => x['CRMasterId'] === crmId);
            return {
              CRMasterId: crmId,
              RatingOn: response['data'].find(x => x['CRMasterId'] === crmId)['RatingOn'],
              SubData: name
            }
          });
        }
      }
      if (Input === 'GetByCallId') {
        if (response && response['data']) {
          this.RatingModel['AutoFail1'] = response['data'][0]['AutoFail1'] !== null ? response['data'][0]['AutoFail1'] : null;
          this.RatingModel['AutoFail2'] = response['data'][0]['AutoFail2'] !== null ? response['data'][0]['AutoFail2'] : null;
          this.RatingModel['Remark'] = (response['data'][0] && response['data'][0]['Remark']) ? response['data'][0]['Remark'] : null;
          let test1 = (response['data'][0] && response['data'][0]['CRSubmasterId']) ? response['data'][0]['CRSubmasterId'].split(',') : [];
          let test2 = (response['data'][0] && response['data'][0]['Score']) ? response['data'][0]['Score'].split(',') : [];
          this.finalDetails.map(element => {
            element.SubData.map(sub => {
              let i = test1.findIndex(x => Number(x) === Number(sub['CRSubMasterId']));
              sub['rating'] = (i !== -1) ? test2[i] : null;
            });
          });
        }
      }
    });
    this._EventSubscription.push(GetMastercallRating);
  }

  // after click on call Rating button

  openRatingPopup = () => {
    this.RatingModel['CallId'] = this.CallId;
    this.RatingModel['UserType'] = 'Enquiry';
    this.RatingModel['LeadId'] = this.id;
    this.getMasterCallRatingDetails('GetByCallId');
    this.callRatingPopup.show();
  }


  // ---- for inserting call Rating
  InsertUpdaterating = () => {
    let test1 = [];
    this.finalDetails.map(main => {
      main.SubData.map(sub => {
        if (sub['rating'] && sub['rating'] !== '') {
          test1.push({
            CRSubMasterId: sub['CRSubMasterId'],
            Score: sub['rating']
          });
        }
      });
    });

    let Id = test1.map(x => x['CRSubMasterId']).join(',');
    let Rating = test1.map(x => x['Score']).join(',');

    const InsertUpdatecallrating = this.preSalesleadDetailsService.InsertUpdatecallrating(this.loggedInuserDetails, this.RatingModel, Id, Rating).subscribe((response) => {
      if (response && response['successful']) {
        this.showSnackBar('Rating Submitted Successfully');
      } else {
        this.showSnackBar('Could Not Submit Rating.Contact IT Support');
      }
      //  this.getConversationDetails(this.status);
      this.callRatingPopup.hide();
      this.RatingModel = [];
    });
    this._EventSubscription.push(InsertUpdatecallrating);
  }

  showSnackBar = (message: string) => {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
  //------- success snabar method -------//
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, {
      duration: 5000,
      panelClass: ["blue-snackbar"],
    });
  };
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, {
      duration: 7000,
      panelClass: ["red-snackbar"],
    });
  };

  forRadioButton(value) {
    this.leadinfoDetails.IsNRI = value == 1 ? true : false;
  }
  //** action for ng On Destroy  **/
  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}
