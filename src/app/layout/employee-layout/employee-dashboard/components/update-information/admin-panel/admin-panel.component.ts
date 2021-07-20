import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";
import { AdminPanelService } from "src/app/shared/services/employee/admin-panel.service";
import { FileAttachment } from "src/app/shared/components/file-upload/file-attachment.model";
import {
  IsourcecampaignModel,
  IadminPanelModel,
  IEmployeeDetail,
  IemployeeName,
  IallLogDetails,
  IenquiryEmployeeName,
  IimportModel,
} from "src/app/shared/models/employeeModel/adminPanel.model";
import { MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";
import { IloggedInuserDetails } from "src/app/shared/models/Authentication/loggedInuserDetails.model";
import * as moment from 'moment';
@Component({
  selector: "tru-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  @ViewChild("adminDetails", { static: false })
  public adminDetails: ModalDirective;
  @ViewChild("importpopup", { static: false })
  public importpopup: ModalDirective;
  @ViewChild("importMigrationpopup", { static: false })
  public importMigrationpopup: ModalDirective;
  public showemail: string;
  public showmobile: string;
  public q1: number;
  public Name: string[];
  public p1: number;
  public q: number = 1;
  public p2: number;
  public isMobileAvailable: boolean;
  public isEmailAvailable: boolean;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public AdminPanelForm: string[] = [];
  public adminPanelModel: IadminPanelModel = <IadminPanelModel>{};
  public selectedProjectNames: object[] = [];
  public selectedEmployeeRoles: object[] = [];
  public selectedEmployeeName: object[] = [];
  public selectedLocations: object[] = [];
  public projectName: string = "";
  public Modal_Title: string;
  public Button_Name: string;
  public ID: number;
  public Listlength: number;
  public EmployeeDetail: IEmployeeDetail = <IEmployeeDetail>{};
  public isLoading: boolean = false;
  public showLogDetailsGrid: boolean = false;
  public employeeName: IemployeeName = <IemployeeName>{};
  public showSuccessfullImportMessage: string;
  public showReenagedLeadsMessage: string;
  public viewLogDetailsButton: boolean = true;
  public allLogDetails: IallLogDetails[] = [];
  public importExcel: FileAttachment[] = [];
  public enquiryEmployeeName: object[] = [];
  public TypeOfUser: string;
  public name: string;
  public hideForPresalesAdmin: boolean = false;
  public headerModal: string;
  public importModel: IimportModel = <IimportModel>{};
  public selectedEmp: string[] = [];
  public selectedDays: string[] = [];
  public isSpinner: boolean = false;
  public disableButton: boolean = false;
  public getAllFlagDetails: string[] = [];
  public previousMobile: string;
  public sourcecampaignModel: IsourcecampaignModel = <IsourcecampaignModel>{};
  public sourceCampaignList: string[] = [];
  public collapsed: boolean = true;
  public campaignInfo: string;
  public sourceInfo: string;
  public Type: string[] = [];
  public disableFields: boolean = false;
  public checkType: boolean = false;
  public hideFields: boolean = false;
  public Message: string;
  public registration: boolean = false;
  public chechbox: boolean;
  public showSuccessfullMessage: string = "";
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  public WeekDay: any = [
    { value: "Monday" },
    { value: "Tuesday" },
    { value: "Wednesday" },
    { value: "Thursday" },
    { value: "Friday" },
    { value: "Saturday" },
    { value: "Sunday" },
  ];
  public levelInfo: any = [
    { key: "L1", value: "L1" },
    { key: "L2", value: "L2" },
    { key: "L3", value: "L3" },
  ];
  public assignedCityInfo: any = [
    { key: "Pune", value: "Pune" },
    { key: "Mumbai", value: "Mumbai" },
    { key: "Nashik", value: "Nashik" },
    { key: "Nagpur", value: "Nagpur" },
    { key: "Aurangabad", value: "Aurangabad" },
  ];
  public sourceCampaignType: any = [
    { key: "Source", value: "Source" },
    { key: "Campaign", value: "Campaign" },
  ];
  public empTypeList: any = [
    { key: "Part Time", value: "Part Time" },
    { key: "Full Time", value: "Full Time" },
    { key: "OnDemand", value: "OnDemand" },
  ];
  public ModuleDetails: any = [
    { key: "Phase1", value: "Phase1" },
    { key: "Execution", value: "Execution" },
    { key: "HRMS", value: "HRMS" },
    { key: "Marketing", value: "Marketing" },
    { key: "Accounting", value: "Accounting" },
  ];

  public reportSubscription: Array<Subscription> = [];
  @ViewChild("createProjectStatusModel", { static: false })
  public createProjectStatusModel: ModalDirective;
  public auditList: {};
  public selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
  public StartDate: any;
  public EndDate: any;
  public EmpolyeeAuditTable: Boolean = false;
  public AuditDetails : String = '';
  @ViewChild('AuditDetailsModal', { static: false }) public AuditDetailsModal: ModalDirective;

  constructor(
    private adminPanelServices: AdminPanelService,
    private snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem("LoggedinUser")) {
      this.loggedInuserDetails = JSON.parse(
        localStorage.getItem("LoggedinUser")
      );
      if (this.loggedInuserDetails) {
        this.GetSelectedProjectsList();
        this.GetSelectedRoleList();
        this.GetSelectedEmployeeNameList();
        this.GetSelectedLocationList();
        this.getAllFlag();
        this.projectName = "";
        this.getEmployeeList();
        this.GetAllSalesEmployeeName(3);
        this.GetAllSalesEmployeeName(5);
        this.hideForPresalesAdmin =
          this.loggedInuserDetails.Role === 11 ? true : false;
        this.sourcecampaignModel["Type"] = "";
        this.getSourceCamapignList();
        this.sourcecampaignModel["Type"] = "";
      }
    } else {
      this.router.navigate(["/login"]);
    }
    this.importModel["Source"] = "";
    this.importModel["Campaign"] = "";
  }
  // **** Get Source and Campaign List **** //
  getSourceCamapignList = () => {
    const getSourceCampaign = this.adminPanelServices
      .getSourceCampaign(this.loggedInuserDetails, this.Type)
      .subscribe((response) => {
        if (response && response["data"]) {
          this.campaignInfo = response["data"].filter(
            (x) => x.Type === "Campaign"
          );
          this.sourceInfo = response["data"].filter((x) => x.Type === "Source");
        }
      });
    this.reportSubscription.push(getSourceCampaign);
  };
  //**** End ****/
  GetSelectedProjectsList = () => {
    const GetProjectListOnSelected = this.adminPanelServices
      .GetProjectListOnSelected(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"]) {
          this.selectedProjectNames = response["data"];
        }
      });
    this.reportSubscription.push(GetProjectListOnSelected);
  };
  GetSelectedLocationList = () => {
    this.adminPanelServices
      .GetLocationOnSelected(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"]) {
          this.selectedLocations = response["data"][0];
        }
      });
  };
  GetSelectedRoleList = () => {
    const GetRoleSelected = this.adminPanelServices
      .GetAllEmployeesRolesOnSelected()
      .subscribe((response) => {
        if (response && response["data"]) {
          this.selectedEmployeeRoles = response["data"];
        }
      });
    this.reportSubscription.push(GetRoleSelected);
  };
  GetSelectedEmployeeNameList = () => {
    const GetAEmployeeSelect = this.adminPanelServices
      .GetAllEmployeesNamesOnSelected()
      .subscribe((response) => {
        if (response && response["data"]) {
          this.selectedEmployeeName = response["data"];
        }
      });
    this.reportSubscription.push(GetAEmployeeSelect);
  };
  getAllFlag = () => {
    this.adminPanelServices.GetAllFlag().subscribe((response) => {
      if (response && response["data"]) {
        this.getAllFlagDetails = response["data"];
      }
    });
  };
  getMobileValidation = (mobile) => {
    if (this.previousMobile !== mobile) {
      var mobilepattern: any = /^\d{10}$/;
      if (mobile && mobile.length === 10 && mobilepattern.test(mobile)) {
        const getMobileValidation = this.adminPanelServices
          .getMobileValidation(mobile)
          .subscribe((response) => {
            if (response && response["data"][0]) {
              this.isMobileAvailable =
                response["data"][0].IsAvailable === "Available";
              this.showmobile = response["data"][0].IsAvailable;
            }
          });
        this.reportSubscription.push(getMobileValidation);
      } else {
        this.showmobile = "";
      }
    }
  };
  getEmailValidation = (email) => {
    var emailpattern: any = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (email && emailpattern.test(String(email).toLowerCase())) {
      const getEmailValidation = this.adminPanelServices
        .getEmailValidation(email)
        .subscribe((response) => {
          if (response && response["data"][0]) {
            this.isEmailAvailable =
              response["data"][0].IsAvailable === "Available";
            this.showemail = response["data"][0].IsAvailable;
          }
        });
      this.reportSubscription.push(getEmailValidation);
    } else {
      this.showemail = "";
    }
  };
  GetReportingId = (EmployeeNamevalue) => {
    this.adminPanelModel["Name"] = EmployeeNamevalue;
  };

  OnSubmitBtnClick = (AdminPanelForm) => {
    //------- for join the week off day --------//
    let test = [];
    if (this.adminPanelModel.noleadsDay) {
      this.adminPanelModel.noleadsDay.forEach((element) => {
        if (element) test.push(element["value"]);
      });
      this.adminPanelModel["wdays"] = test.join(",");
    }
    //------- End --------//
    //------- for join the weekly off day --------//
    let weeklyOff = [];
    if (this.adminPanelModel.WeeklyOff) {
      this.adminPanelModel.WeeklyOff.forEach((element) => {
        if (element) weeklyOff.push(element["value"]);
      });
      this.adminPanelModel["woff"] = weeklyOff.join(",");
    }
    //------- End --------//
    //For Check switch Role is only for sales and Presales
    this.adminPanelModel.SwitchRole =
      this.adminPanelModel.Role === "SALES" ||
        this.adminPanelModel.Role === "PRESALES"
        ? this.adminPanelModel.SwitchRole
        : false;
    if (this.Button_Name === "Update") {
      const UpdateEmployee = this.adminPanelServices
        .UpdateEmployee(this.loggedInuserDetails, this.adminPanelModel, this.ID)
        .subscribe((response) => {
          response["successful"]
            ? this.showSuccessBar("Updated Successfully")
            : this.showFailedBar("Failed to update.");
        });
      this.reportSubscription.push(UpdateEmployee);
    } else {
      this.adminPanelModel["registration"] = this.registration;
      const InsertEmployee = this.adminPanelServices
        .InsertEmployee(this.loggedInuserDetails, this.adminPanelModel)
        .subscribe((response) => {
          response["successful"]
            ? this.showSuccessBar("Submitted Successfully")
            : this.showFailedBar("Failed to update.");
        });
      this.reportSubscription.push(InsertEmployee);
    }
    this.getEmployeeList();
    this.clearInput(AdminPanelForm);
    this.adminDetails.hide();
  };
  clearInput = (AdminPanelForm) => {
    this.adminPanelModel = <IadminPanelModel>{};
    this.adminPanelModel.WeeklyOff = [];
    AdminPanelForm.reset();
    this.showmobile = "";
    this.showemail = "";
  };
  viewLogDetails = () => {
    //************* View Enquiry Log Details *************//
    const getAllLogList = this.adminPanelServices
      .getAllLogList(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"].length > 0) {
          this.allLogDetails = response["data"];
          this.showLogDetailsGrid = true;
          this.showReenagedLeadsMessage = "";
          this.viewLogDetailsButton = true;
        } else {
          this.Message = "No data for Reengaged Leads";
        }
      });
    this.reportSubscription.push(getAllLogList);
  };
  openModal = (status, details, AdminPanelForm) => {
    //.....open modal method to Create or update record...........//
    if (status == 2 && details != null) {
      this.Modal_Title = "Update Employee Details";
      this.Button_Name = "Update";
      this.hideFields = details && details.EmployeeId === 0 ? true : false;
      this.adminPanelModel = details;
      this.previousMobile = details.MobileNo;
      //------- show selected No Leads Day  --------//
      if (details.NoLeadsDay && details.NoLeadsDay !== "") {
        this.selectedDays = details.NoLeadsDay.split(",");
        let test = [];
        this.selectedDays.forEach((element) => {
          test.push({ value: element });
          this.adminPanelModel.noleadsDay = test;
        });
      } //------- End --------//
      //------- show selected week Day Off --------//
      if (details.WeeklyOff && details.WeeklyOff !== "") {
        let weeklyOffDays = details.WeeklyOff.split(",");
        let weeklyoff = [];
        weeklyOffDays.forEach((element) => {
          weeklyoff.push({ value: element });
          this.adminPanelModel.WeeklyOff = weeklyoff;
        });
      } //------- End --------//
      this.ID = details.EmployeeId;
      this.adminDetails.show();
      this.isMobileAvailable = true;
    } else {
      this.Modal_Title = "Create New Employee";
      this.Button_Name = "Submit";
      this.adminPanelModel = <IadminPanelModel>{};
      this.showmobile = "";
      this.showemail = "";
      this.adminDetails.show();
      this.adminPanelModel.Role = "";
      this.isMobileAvailable = false;
      this.hideFields = false;
      AdminPanelForm.reset();
    }
  };

  onCloseUpdate = (AdminPanelForm) => {
    //.....close modal method on click...........//
    this.adminPanelModel = <IadminPanelModel>{};
    this.showmobile = "";
    this.showemail = "";
    this.clearInput(AdminPanelForm);
    this.getEmployeeList();
    this.adminDetails.hide();
  };

  @HostListener("document:keyup", ["$event"]) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.adminDetails.hide();
      this.onClose();
    }
  }

  getEmployeeList = () => {
    //.....method to get all employee Details...........//
    this.isLoading = true;
    this.EmployeeDetail = <IEmployeeDetail>{};
    const getEmployeeList = this.adminPanelServices
      .getEmployeeList(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"] && response["data"].length > 0) {
          if (this.loggedInuserDetails.Role === 11) {
            this.EmployeeDetail = response["data"].filter(
              (x) => x.Role === "PRESALES"
            );
          } else {
            this.EmployeeDetail = response["data"];
          }
          this.Listlength = this.EmployeeDetail["length"];
          this.isLoading = false;
        }
      });
    this.reportSubscription.push(getEmployeeList);
  };
  selectedRole = (Role) => {
    let roleDetails = this.selectedEmployeeRoles.filter(
      (x) => x["Role"] === Role
    );
    this.adminPanelModel.ModuleName = roleDetails[0]["Type"];
  };
  flagChangeUpdate(e, flagName) {
    //.....update Flag........//
    const utilityFlag = this.adminPanelServices
      .utilityFlag(this.loggedInuserDetails, e.checked, flagName)
      .subscribe((response) => {
        if (response && response["successful"]) {
          this.showSuccessBar("Flag Updated Successfully");
        } else {
          this.showFailedBar("Could Not Update Flag");
        }
      });
    this.reportSubscription.push(utilityFlag);
    //.....End.....//
  }

  GetAllSalesEmployeeName(Role) {
    //************* Get All Employee Name In Sales Agent Assign *************//
    const getAllSalesEmployeeOnSelected = this.adminPanelServices
      .getAllSalesEmployeeOnSelected(Role)
      .subscribe((response) => {
        if (response && response["data"]) {
          switch (Role) {
            case 3:
              this.employeeName = response["data"];
              break;
            case 5:
              this.enquiryEmployeeName = response["data"];
              break;
          }
          this.importModel["employeeSelected"] = "";
        }
      });
    this.reportSubscription.push(getAllSalesEmployeeOnSelected);
    //************* End *************//
  }

  selectedEmployee = (event, employeeId) => {
    //************* Selected Employee will store in Variable *************//
    if (event) {
      this.selectedEmp.push(employeeId);
    } else {
      let index = this.selectedEmp.indexOf(employeeId);
      if (index !== -1) {
        this.selectedEmp.splice(index, 1);
      }
    }
    //************* End *************//
  };
  disableBtn = (importmodel, importExcel) => {
    //************* disable Upload Button *************//
    let disableBtn = true;
    if (
      this.disableButton ||
      (importmodel.Source &&
        importmodel.Source.length > 0 &&
        this.selectedEmp.length > 0 &&
        importExcel.length > 0)
    ) {
      disableBtn = false;
    }
    return disableBtn;
    //************* End *************//
  };
  importLeadExcel = (importExcel) => {
    //************* import Excel file for Enquiry *************//
    this.importModel["empIds"] = this.selectedEmp.join(",");
    let importEnquiryExcelVariable = [];
    if (importExcel.length > 1) {
      let test = importExcel.length;
      importEnquiryExcelVariable.push(importExcel[test - 1]);
    } else {
      importEnquiryExcelVariable = importExcel;
    }
    this.isSpinner = true;
    this.disableButton = true;
    const importExcel1 = this.adminPanelServices
      .importExcel(
        this.loggedInuserDetails,
        importEnquiryExcelVariable,
        this.importModel
      )
      .subscribe((response) => {
        if (response) {
          this.showSuccessfullImportMessage = String(response);
          this.viewLogDetailsButton = false;
          this.employeeName;
          this.enquiryEmployeeName = [];
          this.isSpinner = false;
          this.disableButton = false;
        }
        this.importExcel = [];
        this.GetAllSalesEmployeeName(3);
        this.GetAllSalesEmployeeName(5);
        this.importModel["Source"] = "";
        this.importModel["Campaign"] = "";
      });
    this.reportSubscription.push(importExcel1);
    //************* End *************//
  };

  importMigrationExcel = (importExcel) => {
    //************* import Migration Data file for Enquiry And Referrals *************//
    this.importModel["empIds"] = this.selectedEmp.join(",");
    let importEnquiryExcelVariable = [];
    if (importExcel.length > 1) {
      let test = importExcel.length;
      importEnquiryExcelVariable.push(importExcel[test - 1]);
    } else {
      importEnquiryExcelVariable = importExcel;
    }
    this.isSpinner = true;
    this.disableButton = true;
    const importMigrationExcel = this.adminPanelServices
      .importMigrationExcel(
        this.loggedInuserDetails,
        importEnquiryExcelVariable
      )
      .subscribe((response) => {
        if (response) {
          this.showSuccessfullImportMessage = String(response);
          this.viewLogDetailsButton = false;
          this.employeeName;
          this.enquiryEmployeeName;
          this.isSpinner = false;
          this.disableButton = false;
        }
        this.importExcel = [];
        this.GetAllSalesEmployeeName(3);
        this.GetAllSalesEmployeeName(5);
        this.importModel["Source"] = "";
        this.importModel["Campaign"] = "";
      });
    this.reportSubscription.push(importMigrationExcel);
    //************* End *************//
  };

  openEnquiryImport = () => {
    //************* Enquiry Import Btn click  *************//
    this.importpopup.show();
    this.headerModal = "Enquiry Import";
    this.importModel["TypeOfUser"] = "Enquiry";
    this.GetAllSalesEmployeeName(3);
    //************* End *************//
  };

  openMigrationImport = () => {
    //************* Enquiry Import Btn click  *************//
    this.headerModal = "Migration Import";
    this.importModel["TypeOfUser"] = "Enquiry";
    this.importMigrationpopup.show();
    //************* End *************//
  };

  openReferralImport = () => {
    //************* Referral Import Btn click *************//
    this.importpopup.show();
    this.headerModal = "Referral Import";
    this.importModel["TypeOfUser"] = "Referral";
    this.GetAllSalesEmployeeName(5);
    //************* End *************//
  };
  onClose = () => {
    //************* For Close Pop Up *************//
    this.importpopup.hide();
    this.importMigrationpopup.hide();
    this.selectedEmp = [];
    this.isSpinner = false;
    this.disableButton = false;
    this.showSuccessfullImportMessage = "";
    this.showReenagedLeadsMessage = "";
    this.showLogDetailsGrid = false;
    this.allLogDetails = [];
    this.viewLogDetailsButton = true;
    this.importExcel = [];
    //************* End *************//
  };
  // ****  Open modal Pop For Source ****//
  sourceCamapign = (Type) => {
    this.checkType = Type === "Source" ? false : true;
    this.getSourceCampaign(Type);
  };

  // **** Insert Source and Campaign ****//
  onInsertButton = (sourcecampaignModel, sourceCampaignForm) => {
    const insertSourceCampaign = this.adminPanelServices
      .insertSourceCampaign(this.loggedInuserDetails, sourcecampaignModel)
      .subscribe((response) => {
        if (response && response["successful"]) {
          this.showSuccessfullMessage = "Campaign/Source Added Successfully";
          this.sourcecampaignModel["Type"] = "";
          this.sourcecampaignModel = <IsourcecampaignModel>{};
          sourceCampaignForm.form.markAsPristine();
          sourceCampaignForm.form.markAsUntouched();
        } else {
          this.showSuccessfullMessage = "Campaign/Source Insertion Failed";
        }
        setTimeout(() => {
          this.showSuccessfullMessage = "";
        }, 3000);
      });
    this.reportSubscription.push(insertSourceCampaign);
  };
  // **** Get List Of Source and Campaign****//
  getSourceCampaign = (Type) => {
    const getSourceCampaign = this.adminPanelServices
      .getSourceCampaign(this.loggedInuserDetails, Type)
      .subscribe((response) => {
        if (response && response["data"]) {
          this.sourceCampaignList = response["data"];
        }
      });
    this.reportSubscription.push(getSourceCampaign);
  };
  checkDuplication = (name) => {
    this.disableFields = this.sourceCampaignList.find(
      (x) => x["Name"].toLowerCase() === name.toLowerCase()
    )
      ? true
      : false;
  };
  onClick = (event) => {
    this.hideFields = event.checked === true ? true : false;
    this.Button_Name = this.hideFields === true ? "Register" : "";
    this.registration = true;
  };
  ngOnDestroy() {
    for (let item of this.reportSubscription) {
      item.unsubscribe();
    }
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  //********** show snackbar for message **********//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, {
      duration: 5000,
      panelClass: ["red-snackbar"],
    });
  };
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, {
      duration: 5000,
      panelClass: ["blue-snackbar"],
    });
  };
  openmodal() {
    this.createProjectStatusModel.show();
  }
  onpopClose = () => {
    //-------reset popup Form and remove messages-------//
    this.createProjectStatusModel.hide();
  };
  // this is used for selecting todays date
  todaysDateSelect() {
    this.StartDate = moment();
    this.EndDate = moment();
    this.GetAuditTableDetails(this.StartDate, this.EndDate);
    this.selectedDateRange = { startDate: moment(), endDate: moment() };
  }
  // to get the information of audit table
  GetAuditTableDetails = (startDate, endDate) => {
    const GetAudiTable = this.adminPanelServices
      .getAuditTable(this.loggedInuserDetails, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), 'Employee_Audit')
      .subscribe((response) => {
        if (response && response["data"] && response["data"].length > 0) {
          this.auditList = response["data"];
        }
      });
  }
  onChangeDate = (selectedDateRange) => {
    if (selectedDateRange != undefined && selectedDateRange.startDate != null && selectedDateRange.endDate != null) {
      //********* when date range change *********//
      this.StartDate = selectedDateRange.startDate;
      this.EndDate = selectedDateRange.endDate;
      this.GetAuditTableDetails(this.StartDate, this.EndDate)
      //********* End *********// 
    }
  }
  // this is used to show the details of the updated model
  showDetailsPopUp = (details, input) => {
    if (input === 'open') {
      this.AuditDetails = details.toString();
      this.AuditDetailsModal.show();
    } else {
      this.AuditDetailsModal.hide();
    }
  }
}
