import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, forkJoin } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { OrderService } from 'src/app/shared/services/employee/order.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { EncryptDecryptService } from 'src/app/shared/services/shared/encrypt-decrypt.service';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { OrderPdfService } from 'src/app/shared/services/shared/order-pdf.service';

@Component({
    selector: 'tru-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnChanges, OnDestroy {
    @Input() orderInfo: any;
    @ViewChild('popupCompanyNameModel', { static: false }) public popupCompanyNameModel: ModalDirective;
    @ViewChild('summaryDetailsModel', { static: false }) public summaryDetailsModel: ModalDirective;
    @ViewChild('salesDuplicationModel', { static: false }) public salesDuplicationModel: ModalDirective;
    // public uniqueSearchId: any;
    public mandatoryFieldsMessage: boolean = true;
    public showBasicCostPercent: boolean = true;
    public isDisableOnBrokerAssigned: boolean = true;
    public isLoadingOrderSubmitMessage: boolean = false;
    public isLoadingOrderDetails: boolean = false;
    // public isLoadingAgreementSubmitMessage: boolean = false;
    public isLoadingAccordion: boolean = false
    public showAccordion: boolean = false;
    public preferredBuildingTypeLists: any = [];
    public preferredBhkLists: any = [];
    // public preferredLayoutTypeLists: any = [];
    public preferredFlatNumberLists: any = [];
    public selectedProjectNames: any = [];
    // public hideSalesAgentId: number;
    public customers: Observable<any[]>;
    // public searchTerms = new Subject<string>();
    public txtCustomerName = '';
    public txtMobileNumber = '';
    public txtEmailId = '';
    public ClientList: any;
    public term: any;
    public flag: boolean = true;
    public isFirstOpen = true;
    public isFieldDisabled: boolean = false;
    public ErrorForInvalidSearch = '';
    public showSelectedListNotFoundMessage = '';
    public showInvalidCustomerSearchError = '';
    public showDateNotMatchMessage = '';
    // public selectValidDateRangeMessage = '';
    public showOrderSuccessfullMessage = '';
    public showOrderUnSuccessfullMessage = '';
    public showOrderUpdateSuccessfullMessage = '';
    public showOrderUpdateUnSuccessfullMessage = '';
    public showUpdateRateSuccessfullMessage = '';
    public showUpdateRateUnSuccessfullMessage = '';
    public showAgreementSuccessfullMessage = '';
    public NoDataFoundMessageOnSearch = '';
    public NoDataFoundMessageOnUpdateSearch = '';
    public loggedInuserDetails: any;
    public sessionModel: any = {};
    public orderModel: any = {};
    public isLoadingUpdateOrderDetails: boolean = false;
    public isDisabledForUpdate: boolean = true;
    public showOrderGridArray: any = [];
    public showOrderGridArrayUpdate: any = [];
    public isButtonHideForUpdate: boolean = false;
    public isButtonHideForSubmit: boolean = false;
    public isButtonDisabledForUpdate: boolean = true;
    public collapsed: boolean = true;
    public hideEditButton: boolean;
    public hideEditRateButtonInitially: boolean = true;
    public companyNameForInvoice: string;
    public EnterCompanyName: any;
    public EnterRERARegistrationNo: any;
    public PDFOrderDetails: any;
    public brokerDetails: any = [];
    public isLoading: boolean = false;
    public SummaryDetails: any = [];
    public SummaryByBuilding: any = [];
    public orderSearch = '';
    // public TodaysDateMsg = 'By default Todays Date is Selected';
    public selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
    public StartDate: any;
    public EndDate: any;
    public SumProjectName = '';
    public TotalReferralId: any = [];
    public TotalOrdersByPresales: number = 0;
    public getheaderPreSales: string[] = [];
    public tabledataPreSales: any = [];
    public emailPattren: any;
    public details: number;
    public detailsbybuilding: number = 1;
    // public hideBrokerId: any;
    public isSpinnerActive: boolean = true;
    //Constants
    public preferredSchemeList: any = [
        { key: "No Scheme", value: "No Scheme" },
        { key: "0.5", value: "0.995" },
        { key: "1", value: "0.99" },
        { key: "1.5", value: "0.985" },
        { key: "2", value: "0.98" },
        { key: "2.5", value: "0.975" },
        { key: "3", value: "0.97" },
        { key: "3.5", value: "0.965" },
        { key: "4", value: "0.96" },
        { key: "4.5", value: "0.955" },
        { key: "5", value: "0.95" },
        { key: "5.5", value: "0.945" },
        { key: "6", value: "0.94" },];
    public filterStatus: any = [
        { key: "jan", value: "Jan" },
        { key: "feb", value: "Feb" },
        { key: "mar", value: "Mar" },
        { key: "apr", value: "Apr" },
        { key: "may", value: "May" },
        { key: "jun", value: "Jun" },
        { key: "jul", value: "Jul" },
        { key: "aug", value: "Aug" },
        { key: "sep", value: "Sep" },
        { key: "oct", value: "Oct" },
        { key: "nov", value: "Nov" },
        { key: "dec", value: "Dec" }];
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
    // OrderDetailsBySales: any;
    public Count: number = 0;
    public TotalOrders: number = 0;
    public SwitchSummeryName: string;
    public Showsummery: boolean = false;
    public getheaderSales: string[] = [];
    public getheaderByProject: string[] = [];
    public TableDataSales: any = [];
    public TableDataProject: any = [];
    // public getOrderDetailsModel: any = [];
    public noDataMsg = '';
    public disableButton: boolean = false;
    public enablePan1: boolean = false;
    public enablePan2: boolean = false;
    public CurrentPageId: number;
    public CurrentPageId1: number = 1;
    public p1: number = 1;
    public uploadStampDutyFile: FileAttachment[] = [];
    public filterData: string[] = [];
    private _EventSubscription: Array<Subscription> = [];
    public pdfImageDetails: string[] = [];
    // public showCancelOrder: boolean = false;
    constructor(public router: Router, private orderService: OrderService,
        private orderPdfService: OrderPdfService, private sharedService: SharedService,
        private encryptDecryptService: EncryptDecryptService) { }

    ngOnInit(): void {
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
        this.sessionModel.EntityId = this.loggedInuserDetails.EntityId;
        this.orderModel.custType = "employee";
        this.SwitchSummeryName = ' Show Summary';
        this.isSpinnerActive = this.orderInfo['redirectTo'] === true ? true : false;
        if (sessionStorage.ocrbankdetails && this.orderInfo && this.orderInfo.length === 0) {
            var Data = JSON.parse(sessionStorage.getItem('ocrbankdetails'));
            let depData = this.encryptDecryptService.decryptData(Data);
            this.showOrderGridArray = depData[0]['showOrderGridArray'] ? depData[0]['showOrderGridArray'] : [];
            this.CurrentPageId = depData[0]['pageid'] ? depData[0]['pageid'] : 1;
            this.CurrentPageId1 = depData[0]['pageid1'] ? depData[0]['pageid1'] : 1;
            this.NoDataFoundMessageOnSearch = '';
            this.NoDataFoundMessageOnUpdateSearch = '';
            this.showAgreementSuccessfullMessage = '';
            this.showOrderGridArray = this.showOrderGridArray.length > 0 ? this.showOrderGridArray : [];
            this.showOrderGridArray['count'] = this.showOrderGridArray.length > 0 ? this.showOrderGridArray.length : 0;

            this.TableDataProject = depData[0]['TableDataProject'].length > 0 ? depData[0]['TableDataProject'] : [];
            this.TableDataSales = depData[0]['TableDataSales'].length > 0 ? depData[0]['TableDataSales'] : [];
            this.tabledataPreSales = depData[0]['tabledataPreSales'].length > 0 ? depData[0]['tabledataPreSales'] : [];
            this.showOrderGridArrayUpdate = depData[0]['showOrderGridArrayUpdate'].length > 0 ? depData[0]['showOrderGridArrayUpdate'] : [];
            this.TotalOrders = depData[0]['TotalOrders'];
            this.getheaderSales = depData[0]['getheaderSales'].length > 0 ? depData[0]['getheaderSales'] : [];
            this.TotalOrdersByPresales = depData[0]['TotalOrdersByPresales'] ? depData[0]['TotalOrdersByPresales'] : null;
            this.getheaderByProject = depData[0]['getheaderByProject'].length > 0 ? depData[0]['getheaderByProject'] : [];
            this.Count = depData[0]['Count'];
            this.SwitchSummeryName = depData[0]['SwitchSummeryName'];
            this.collapsed = depData[0]['collapsed'];
            this.StartDate = depData[0]['StartDate'];
            this.EndDate = depData[0]['EndDate'];
            this.Showsummery = depData[0]['Showsummery'];// this.showAccordion ? false : true;   
        }
        this.getProjectBookingDetails();
    }
    // ***** Booking Pdf Header image(Project name and all) get from marketing *****//
    getProjectBookingDetails = () => {
        let searchModel = [];
        searchModel['Input'] = 'SearchByStakeholder';
        searchModel['StakeholderType'] = this.loggedInuserDetails.UserType;
        searchModel['DocType'] = 'Booking Pdf';
        searchModel['DocId'] = null;
        this.orderService.getDocumentCategoryService(this.loggedInuserDetails, searchModel).subscribe(response => {
            if (response && response['data'][0]) {
                this.pdfImageDetails = response['data'][0] ? response['data'][0] : [];
            }
        })
    }
    SessionCreate() {
        let Data = [];
        Data.push({
            showOrderGridArray: this.showOrderGridArray.length > 0 ? this.showOrderGridArray : [],
            showOrderGridArraycount: this.showOrderGridArray.length > 0 ? this.showOrderGridArray.length : 0,
            pageid: this.CurrentPageId,
            pageid1: this.CurrentPageId1,
            Showsummery: this.Showsummery,
            TableDataProject: this.TableDataProject.length > 0 ? this.TableDataProject : [],
            TableDataSales: this.TableDataSales.length > 0 ? this.TableDataSales : [],
            tabledataPreSales: this.tabledataPreSales.length > 0 ? this.tabledataPreSales : [],
            showOrderGridArrayUpdate: this.showOrderGridArrayUpdate.length > 0 ? this.showOrderGridArrayUpdate : [],
            TotalOrders: this.TotalOrders,
            getheaderSales: this.getheaderSales.length > 0 ? this.getheaderSales : [],
            TotalOrdersByPresales: this.TotalOrdersByPresales ? this.TotalOrdersByPresales : null,
            getheaderByProject: this.getheaderByProject.length > 0 ? this.getheaderByProject : [],
            Count: this.Count,
            SwitchSummeryName: this.SwitchSummeryName,
            collapsed: this.collapsed,
            StartDate: this.StartDate,
            EndDate: this.EndDate,
            showAccordion: this.showAccordion ? true : false
        });
        let encryptedData = this.encryptDecryptService.encryptData(Data);
        sessionStorage.setItem('ocrbankdetails', JSON.stringify(encryptedData));
    }
    pageChangeEvent(pageid, Input) {
        Input === "table1" ? this.CurrentPageId = pageid : this.CurrentPageId1 = pageid;
        this.SessionCreate();
    }
    ngOnChanges(changes: SimpleChanges) {
        //-------For Customer Order Details Changes-------//
        if (changes.orderInfo && this.orderInfo && this.orderInfo.ReferralId !== undefined) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.orderInfo && this.orderInfo['redirectTo'] === true) {
                this.isSpinnerActive = true;
                this.orderModel['FormDashboard'] = true;
                this.orderModel['OrderId'] = this.orderInfo['OrderId'];
                const GetSearchDetails = this.orderService.GetSearchDetails(this.loggedInuserDetails, this.orderModel, 'CustomerGetByOrderId').subscribe((response) => {
                    if (response && response['data'] && response['data'].length > 0) {
                        let data = response['data'];
                        this.filterData = (data && data.length > 0) ? data.find(x => x['OrderId'] === this.orderInfo['OrderId']) : null;
                        (this.filterData && this.filterData !== undefined) ? this.emitOrderID(this.filterData, 2) : null;
                    } else {
                        this.isSpinnerActive = false;
                    }
                    (this.filterData === undefined || this.filterData === null) ? this.isSpinnerActive = false : null;
                    this.onClickCreateOrderBtn();
                    this.orderInfo.EntityId = this.orderInfo.ReferralId;
                    this.onselectCustomer(this.orderInfo);
                    this.isFirstOpen = true;
                });
                this._EventSubscription.push(GetSearchDetails);
            } else {
                this.orderInfo['redirectTo'] = false;
            }
        }
    }
    searchCustomer(term: string): void {
        //--------Search Customer Details List-------//
        this.flag = true;
        this.txtMobileNumber = '';
        this.txtEmailId = '';
        this.orderModel.BrokerId = '';
        this.orderModel.SalesAgentId = '';
        this.orderModel.BrokerAssinged = '';
        this.orderModel.SalesAgentAssinged = '';
        this.orderModel.IncentiveProposed = '';
        this.showInvalidCustomerSearchError = "Please Select Name From Searched List.";
        // this.searchTerms.next(term);
        this.sharedService.search(this.loggedInuserDetails, term).subscribe((response) => {
            this.customers = response['data'] && response['data'].filter(x => x.UserType === 'Referral' || x.UserType === 'Customer');
        })
    }
    onselectCustomer(ClientObj) {
        //--------Select Customer Details From Search List-------//
        if (ClientObj) {
            this.ClientList = ClientObj;
            this.flag = false;
            ClientObj.ReferralEmail ? ClientObj.UserId = ClientObj.ReferralEmail : null;
            this.isDisableOnBrokerAssigned = false;
            this.showInvalidCustomerSearchError = '';
            this.ErrorForInvalidSearch = '';
            if (ClientObj.LastName === '' || ClientObj.LastName === null || ClientObj.LastName === undefined) {
                this.txtCustomerName = `${ClientObj.FirstName}`;
            } else {
                this.txtCustomerName = `${ClientObj.FirstName} ${ClientObj.LastName}`;
            }
            this.txtMobileNumber = `${ClientObj.MobileNo}`;
            this.txtEmailId = `${ClientObj.UserId}`;
            const GetBrokerId = this.orderService.GetBrokerId(this.loggedInuserDetails, ClientObj).subscribe((response) => {
                if (response && response['data'][0]) {
                    this.brokerDetails = response['data'][0];
                    this.orderModel.BrokerId = this.brokerDetails.BrokerId ? this.brokerDetails.BrokerId : '';
                    this.orderModel.BrokerAssinged = this.brokerDetails.BrokerAssinged ? this.brokerDetails.BrokerAssinged : '';
                    this.orderModel.SalesAgentId = this.brokerDetails.SalesAgentId;
                    this.orderModel.SalesAgentAssinged = this.brokerDetails.SalesAgentAssinged;
                    this.isDisableOnBrokerAssigned = this.brokerDetails.ReferredByType === 'ChannelPartner' || this.brokerDetails.ReferredByType === 'CRO' ? false : true;
                    if (this.brokerDetails.SalesAgentId !== this.loggedInuserDetails.EntityId) {
                        this.salesDuplicationModel.show();
                    }
                } else
                    this.isDisableOnBrokerAssigned = true;
            });
            this._EventSubscription.push(GetBrokerId);
            if (ClientObj.UserType === 'Customer' || ClientObj.UserType === 'Referral') {
                this.ErrorForInvalidSearch = '';
            } else {
                this.ErrorForInvalidSearch = "Selected User Must Be The Customer Or Referral";
                this.txtMobileNumber = '';
                this.txtEmailId = '';
            }
        }
    }
    GetAllSearchDetails = () => {
        //--------Get All Order Details On Search-------//
        this.isLoadingOrderDetails = true;
        this.NoDataFoundMessageOnSearch = '';
        this.NoDataFoundMessageOnUpdateSearch = '';
        this.showAccordion = false;
        this.showAgreementSuccessfullMessage = '';
        this.showOrderGridArray = []
        const GetSearchDetails = this.orderService.GetSearchDetails(this.loggedInuserDetails, this.orderModel, 'CustomerAllOrder').subscribe((response) => {
            if (response && response['data']) {
                this.showOrderGridArray = response['data'];
                this.showOrderGridArray['count'] = response['data'].length;
                this.SessionCreate();
                window.scrollTo(0, document.body.scrollTop);
            }
            if (response && response['exception']) {
                this.NoDataFoundMessageOnSearch = "No Records Found For The Search Criteria You Entered, Please Try The Other Criteria.";
            }
            this.isLoadingOrderDetails = false;
        });
        this._EventSubscription.push(GetSearchDetails);
    }
    ScrollDownOnClick = (collapsed) => {
        if (!collapsed) {
            this.isLoadingUpdateOrderDetails = true;
            const GetPendingOrderApprovalDetails = this.orderService.GetPendingOrderApprovalDetails(this.loggedInuserDetails).subscribe((response) => {
                //--------Get All Pending Orders For Approvals-------//
                if (response['data'] && response['data'][0] && this.loggedInuserDetails.Level == 'L1') {
                    this.showOrderGridArrayUpdate = response['data'];
                    window.scrollTo(0, document.body.scrollHeight);
                }
                if (response && response['exception']) {
                    this.NoDataFoundMessageOnUpdateSearch = "No Records Found For The Search Criteria You Entered, Please Try The Other Criteria.";
                }
                this.isLoadingUpdateOrderDetails = false;
            });
            this._EventSubscription.push(GetPendingOrderApprovalDetails);
        }
    }
    GetSelectedProjectsList = () => {
        //--------Get All Project List-------//
        this.orderModel = {};
        const GetProjectListOnSelected = this.orderService.GetProjectListOnSelected(this.loggedInuserDetails).subscribe((response) => {
            if (response["data"]) {
                this.selectedProjectNames = response["data"];
                if (this.selectedProjectNames && this.selectedProjectNames[0]) {
                    this.orderModel.ProjectName = '';
                    this.orderModel.DiscountScheme = "No Scheme";
                    this.orderModel.Source = '';
                    this.orderModel.OrderStatus = '';
                    this.orderModel.BuildingType = '';
                    this.orderModel.BHK = '';
                    this.orderModel.LayoutType = '';
                    this.orderModel.FlatNo = '';
                }
                this.SessionCreate();
            }
        });
        this._EventSubscription.push(GetProjectListOnSelected);
    }
    GetSelectedBuildingTypeList = () => {
        let projDetails = this.selectedProjectNames.filter(x => x['ProjectName'] === this.orderModel.ProjectName);
        this.orderModel.ProjectType = projDetails[0].ProjectType;
        this.orderModel.BookingHeadImage = this.pdfImageDetails.filter(x => x['ProjectId'] === projDetails[0]['ProjectId']).map(x => { return x['FileURL'] })[0];

        // this.orderModel.ProjectType = this.selectedProjectNames.filter(x => x['ProjectName'] === this.orderModel.ProjectName).map(x => { return x.ProjectType })[0];
        //--------Get All Building Type For Selected Project-------//
        const GetBuildingTypeOnSelectedProject = this.orderService.GetBuildingTypeOnSelectedProject(this.loggedInuserDetails, this.orderModel.ProjectName).subscribe((response) => {
            if (response["data"]) {
                this.preferredBuildingTypeLists = response["data"];
                if (this.preferredBuildingTypeLists && this.preferredBuildingTypeLists[0]) {
                    this.orderModel.BuildingType = '';
                    this.orderModel.BHK = '';
                    this.orderModel.LayoutType = '';
                    this.orderModel.FlatNo = '';
                    this.showSelectedListNotFoundMessage = ``;
                } else {
                    this.showSelectedListNotFoundMessage = "The Data Is Not Available For Project Name.";
                }
            }
        });
        this._EventSubscription.push(GetBuildingTypeOnSelectedProject);
    }
    GetSelectedBhkList = () => {
        //--------Get All Bhk List For Selected Building Type-------//
        const GetBhkOnSelectedBuildingType = this.orderService.GetBhkOnSelectedBuildingType(this.loggedInuserDetails, this.orderModel).subscribe((response) => {
            if (response["data"]) {
                this.preferredBhkLists = response["data"];
                if (this.preferredBhkLists && this.preferredBhkLists[0]) {
                    this.orderModel.BHK = '';
                    this.orderModel.FlatNo = '';
                    this.showSelectedListNotFoundMessage = ``;
                } else {
                    this.showSelectedListNotFoundMessage = "The Data Is Not Available For Building Type.";
                }
            }
        });
        this._EventSubscription.push(GetBhkOnSelectedBuildingType);
    }
    GetSelectedFlatNumberList = () => {
        //--------Get All Flat Numbers For Selected Layout Type-------//
        this.orderModel.LayoutType = '';
        const GetFlatNumberOnSelectedLayoutType = this.orderService.GetFlatNumberOnSelectedLayoutType(this.loggedInuserDetails, this.orderModel).subscribe((response) => {
            if (response["data"]) {
                this.preferredFlatNumberLists = response["data"];
                if (this.preferredFlatNumberLists && this.preferredFlatNumberLists[0]) {
                    this.orderModel.FlatNo = '';
                    this.showSelectedListNotFoundMessage = ``;
                } else {
                    this.showSelectedListNotFoundMessage = "The Data Is Not Available For BHK.";
                }
            }
        });
        this._EventSubscription.push(GetFlatNumberOnSelectedLayoutType);
    }
    GetSelectedCarpetAreaList = () => {
        //--------Get All Carpet Area List For Selected Flat No.-------//
        this.hideEditButton = false;
        this.orderModel.StampDuty = this.orderModel.TDS = this.orderModel.GST = this.orderModel.Tax = 0;
        const GetCarpetAreaOnSelectedFlatNumber = this.orderService.GetCarpetAreaOnSelectedFlatNumber(this.loggedInuserDetails, this.orderModel).subscribe((response) => {
            if (response && response["data"] && response["data"][0]) {
                this.orderModel.CarpetArea = response["data"][0].CarpetArea;
                this.orderModel.EnclosedBalcony = response["data"][0].EnclosedBalcony;
                this.orderModel.AttachedTerrace = response["data"][0].AttachedTerrace;
                this.orderModel.ParkingSlot = response["data"][0].ParkingSlot;
                this.orderModel.ReraArea = response["data"][0].ReraArea;
                this.orderModel.FlatView = response["data"][0].FlatView;
                this.orderModel.Rate = response["data"][0].Rate;
                this.orderModel.MonthlyMaintenance = response["data"][0].MonthlyMaintenance;
                this.orderModel.AgreedCost = response["data"][0].AgreedCost ? response["data"][0].AgreedCost : 0;
                this.orderModel.ParkingCharge = response["data"][0].ParkingCharge ? response["data"][0].ParkingCharge : 0;
                this.orderModel.InfraCharge = response["data"][0].InfraCharge ? response["data"][0].InfraCharge : 0;
                this.orderModel.PLC = response["data"][0].PLC ? response["data"][0].PLC : 0;
                this.orderModel.FloorRise = response["data"][0].FloorRise ? response["data"][0].FloorRise : 0;
                this.orderModel.SubTotal = response["data"][0].SubTotal ? response["data"][0].SubTotal : 0;
                this.orderModel.Remark = response["data"][0].Remark;
                this.orderModel.AvgRate = response["data"][0].AvgRate ? response["data"][0].AvgRate : 0;
                this.CalculateAgreedCost(this.orderModel);
                this.showSelectedListNotFoundMessage = ``;
                this.hideEditRateButtonInitially = false;
                this.CalculateSubTotal(this.orderModel);
            } else {
                this.showSelectedListNotFoundMessage = "The Data Is Not Available For Flat Number.";
            }
        });
        this._EventSubscription.push(GetCarpetAreaOnSelectedFlatNumber);
    }
    Validate(event) {
        return (event.charCode != 46 && event.charCode > 31 && (event.charCode < 48 || event.charCode > 57)) ? false : true
    }
    CalculateAgreedCost = (orderModel) => {
        orderModel.SaleableArea = this.orderModel.ReraArea * 10.764;
        // this.roundup('SaleableArea');
        orderModel.SaleableArea = parseFloat(orderModel.SaleableArea).toFixed(4);
        orderModel.LoadingPer = Number(orderModel.LoadingPer) > 0 ? Number(orderModel.LoadingPer) : 0;
        let BillableArea = (Number(orderModel.SaleableArea) / 100) * (orderModel.LoadingPer);
        orderModel.BillableArea = Number(orderModel.SaleableArea) + BillableArea;
        orderModel.BillableArea = parseFloat(orderModel.BillableArea).toFixed(4);
        // this.roundup('BillableArea');
        orderModel.AgreedCost = orderModel.BillableArea * orderModel.Rate;
        // this.roundup('AgreedCost');
        orderModel.AgreedCost = Math.round(orderModel.AgreedCost);
        this.CalculateSubTotal(orderModel);
    }
    OnInsertBtnClick = (OrderForm) => {
        let uploadFile = [];
        if (this.uploadStampDutyFile.length > 0) {
            let len = this.uploadStampDutyFile.length;
            uploadFile.push(this.uploadStampDutyFile[len - 1]);
        }
        //--------Create Order-------//
        this.isLoadingOrderSubmitMessage = true;
        this.orderModel['CustomerName'] = this.orderModel['CustomerName'] ? this.orderModel['CustomerName'] : this.txtCustomerName;
        this.orderModel['Email'] = this.orderModel['Email'] ? this.orderModel['Email'] : this.txtEmailId;
        this.orderModel['MobileNo'] = this.orderModel['MobileNo'] ? this.orderModel['MobileNo'] : this.txtMobileNumber;
        this.orderModel['OrderStatus'] = this.orderModel['BookingAmount'] && this.orderModel['BookingAmount'] > 0 ? 'Booking Amount Paid' : 'no';
        this.isFieldDisabled = true;
        this.orderPdfService.download(this.orderModel, this.EnterCompanyName, this.EnterRERARegistrationNo, 'SendEmail').then((response) => {
            if (response) {
                let file = response[0] ? response : [];
                const InsertOrderDetails = this.orderService.InsertOrderDetails(this.orderModel, this.loggedInuserDetails, this.ClientList, this.sessionModel, uploadFile, file).subscribe((response) => {
                    if (response['successful'] && response['data']) {
                        // **** If ReferredBy Type = Cp || CRO use this for virtual wallet insert **** //
                        if (this.brokerDetails.ReferredByType === 'ChannelPartner' || this.brokerDetails.ReferredByType === 'CRO') {
                            let walletDetails = this.orderModel;
                            walletDetails.OrderId = response['data'][0]['OrderId'];
                            this.updateVirtualWallet(walletDetails);
                        }
                        // **** End ****//
                        this.clearOrderFormAccordion(OrderForm);
                        this.showOrderSuccessfullMessage = "Order Generated Successfully.";
                        this.mandatoryFieldsMessage = false;
                        this.hideEditRateButtonInitially = true;
                    } else {
                        this.showOrderUnSuccessfullMessage = "Order Generation Failed.";
                        this.mandatoryFieldsMessage = true;
                    }
                    this._EventSubscription.push(InsertOrderDetails);
                    setTimeout(() => {
                        this.showOrderSuccessfullMessage = '';
                        this.showOrderUnSuccessfullMessage = '';
                    }, 5000);
                    this.isLoadingOrderSubmitMessage = false;
                    this.GetSelectedProjectsList();
                    this.isFieldDisabled = false;
                });
            }
        });
    }

    OnUpdateBtnClick = () => {
        //--------Update Order-------//
        this.isLoadingOrderSubmitMessage = true;
        const UpdateOrderDetails = this.orderService.UpdateOrderDetails(this.orderModel, this.loggedInuserDetails).subscribe((response) => {
            if (response['successful']) {
                this.showOrderUpdateSuccessfullMessage = "Order Updated Successfully.";
            } else {
                this.showOrderUpdateUnSuccessfullMessage = "Order update's Failed.";
            }
            this._EventSubscription.push(UpdateOrderDetails);
            setTimeout(() => {
                this.showOrderUpdateSuccessfullMessage = '';
                this.showOrderUpdateUnSuccessfullMessage = '';
            }, 5000);
            this.isLoadingOrderSubmitMessage = false;
        });
    }
    // ***** insert into VirtualWallet for Cp and CRO ***** //
    updateVirtualWallet = (orderDetails) => {
        let input = "INSERT";
        orderDetails.TransactionType = "Order";
        orderDetails.ReferredById = this.brokerDetails.ReferredById;
        orderDetails.ReferredByType = this.brokerDetails.ReferredByType;
        const addVirtualPayment = this.orderService.addVirtualPayment(this.loggedInuserDetails, orderDetails, input).subscribe((response) => { });
        this._EventSubscription.push(addVirtualPayment);
    }
    OnChangeUpdateFields = () => {
        this.isButtonDisabledForUpdate = false;
    }
    onDiscountSchemeChange = () => {
        //--------Select Discount Scheme To Calculate Total Value-------//
        if (this.orderModel.DiscountScheme === 'No Scheme') {
            this.orderModel.TotalValue = this.orderModel.DiscountSubTotal = this.orderModel.SubTotal;
        } else {
            this.orderModel.DiscountSubTotal = this.orderModel.SubTotal * this.orderModel.DiscountScheme;
            this.orderModel.TotalValue = this.orderModel.DiscountSubTotal + (this.orderModel.TDS) +
                (this.orderModel.GST) + (this.orderModel.Tax);
        }
        let cost = this.orderModel.DiscountSubTotal / this.orderModel.ReraArea;
        this.disableButton = cost < this.orderModel.AvgRate ? true : false;
    }

    emitOrderID = (orderDetails, sequence) => {
        //--------Show All Order Details From Grid To Accordion-------//
        this.isLoadingAccordion = true;
        this.showAccordion = false;
        const GetProjectListOnSelected = this.orderService.GetProjectListOnSelected(this.loggedInuserDetails);
        const GetBuildingTypeOnSelectedProject = this.orderService.GetBuildingTypeOnSelectedProject(this.loggedInuserDetails, orderDetails && orderDetails.ProjectName ? orderDetails.ProjectName : null);
        const GetBhkOnSelectedBuildingType = this.orderService.GetBhkOnSelectedBuildingType(this.loggedInuserDetails, orderDetails);
        const GetFlatNumberOnSelectedLayoutType = this.orderService.GetFlatNumberOnSelectedLayoutType(this.loggedInuserDetails, orderDetails);
        const GetCarpetAreaOnSelectedFlatNumber = this.orderService.GetCarpetAreaOnSelectedFlatNumber(this.loggedInuserDetails, orderDetails);

        orderDetails.Input = 'CustomerGetByOrderId';
        const GetOrderDetails = this.orderService.GetSearchDetails(this.loggedInuserDetails, orderDetails, 'CustomerGetByOrderId');
        const forkJoinSub = forkJoin([GetProjectListOnSelected, GetBuildingTypeOnSelectedProject, GetBhkOnSelectedBuildingType, GetFlatNumberOnSelectedLayoutType, GetCarpetAreaOnSelectedFlatNumber, GetOrderDetails]).subscribe(response => {

            if (response) {
                this.selectedProjectNames = response[0]["data"];
                this.preferredBuildingTypeLists = response[1]["data"];
                this.preferredBhkLists = response[2]["data"];
                orderDetails.LayoutType = '';
                this.preferredFlatNumberLists = response[3]["data"];
                this.orderModel = response[5]["data"][0];
                // this.orderModel.CarpetArea = Math.round(orderDetails.CarpetArea);
                // this.orderModel.ReraArea = Math.round(orderDetails.ReraArea);
                this.orderModel.CarpetArea = orderDetails.CarpetArea;
                this.orderModel.ReraArea = orderDetails.ReraArea;
                this.CalculateAgreedCost(this.orderModel);
                if (response[4]["data"][0]) {
                    this.orderModel = response[4]["data"][0];
                }

                this.orderModel['BasicCost'] = orderDetails.IncentiveBasedOn ? orderDetails.IncentiveBasedOn : null;
                this.sharedService.shareOrderDetails(orderDetails);
                if (orderDetails.DiscountScheme == 1) {
                    this.orderModel.DiscountScheme = 'No Scheme';
                }
                this.showAccordion = true;
                this.isLoadingAccordion = false;
                this.isSpinnerActive = false;
                window.scrollTo(0, document.body.scrollHeight);
                if (sequence == 1) {
                    this.isDisabledForUpdate = false;
                    this.isButtonHideForSubmit = false;
                } else {
                    this.isDisabledForUpdate = true;
                    this.isButtonHideForSubmit = true;
                }
                this.isFieldDisabled = true;
                this.showSelectedListNotFoundMessage = '';
                this.mandatoryFieldsMessage = false;
                this.isButtonHideForUpdate = true;
                this.isButtonDisabledForUpdate = true;
                this.orderModel.ProjectType = this.selectedProjectNames.filter(x => x['ProjectName'] === this.orderModel.ProjectName).map(x => { return x.ProjectType })[0];
                this.calculatePer(this.orderModel.TDS, 'percentageTDS');
                this.calculatePer(this.orderModel.GST, 'percentageGST');
                this.calculatePer(this.orderModel.StampDuty, 'PercentStampDuty');
            }
            this._EventSubscription.push(forkJoinSub);
        });
    }
    clearOrderFormAccordion = (OrderForm) => {
        //--------Clear Accordion after Insert An Order-------//
        this.orderModel = {};
        OrderForm.form.markAsPristine();
        OrderForm.form.markAsUntouched();
        this.txtCustomerName = '';
        this.txtMobileNumber = '';
        this.txtEmailId = '';
    }
    onChangeSelect(typeValue) {
        //--------Select Source Of Funding From Dropdown-------//
        if (typeValue === `Self`) {
            this.orderModel.BankName = '';
            this.orderModel.BankExecutiveName = '';
            this.orderModel.LoanSanctionLetter = '';
            this.orderModel.LoanSanctionLetterDate = '';
            this.orderModel.NOCIssued = '';
            this.orderModel.NOCIssuedDate = '';
        }
    }
    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }
    onClickCreateOrderBtn() {
        //--------Clear Message on Create Order Button-------//
        this.GetSelectedProjectsList();
        this.isFieldDisabled = false;
        this.NoDataFoundMessageOnSearch = '';
        this.NoDataFoundMessageOnUpdateSearch = '';
        this.showAccordion = true;
        this.isDisabledForUpdate = true;
        window.scrollTo(0, document.body.scrollHeight);
        this.mandatoryFieldsMessage = true;
        this.isButtonHideForUpdate = false;
        this.isButtonHideForSubmit = true;
        this.orderModel.DiscountScheme = 'No Scheme';
    }
    changeBasicCost = (BasicCostSelection) => {
        //--------Calculate Incentive Value by Changing Basic Cost-------//
        if (BasicCostSelection) {
            this.orderModel.BasicCost = BasicCostSelection;
            if (BasicCostSelection === "BasicCost") {
                this.orderModel.IncentiveValue = (this.orderModel.AgreedCost * this.orderModel.IncentiveProposed) / 100;
                this.showBasicCostPercent = true;
            } else {
                this.orderModel.IncentiveValue = (this.orderModel.DiscountSubTotal * this.orderModel.IncentiveProposed) / 100;
                this.showBasicCostPercent = false;
            }
        }
    }
    MatchDate = (orderModel) => {
        //--------Show Message If Date doesn't Match-------//
        if (this.orderModel.LoanSanctionDate === this.orderModel.NOCIssuedDate) {
            this.showDateNotMatchMessage = ``;
        } else { this.showDateNotMatchMessage = "Loan Sanction Date Must be Match With NOC Issued Date"; }
    }
    CalculateSubTotal = (orderModel) => {
        //--------Calculate Subtotal on change Of Agreed Cost-------//
        if (this.orderModel.AgreedCost == '') {
            this.orderModel.AgreedCost = 0;
        }
        if (this.orderModel.ParkingCharge == '') {
            this.orderModel.ParkingCharge = 0;
        }
        if (this.orderModel.FloorRise == '') {
            this.orderModel.FloorRise = 0;
        }
        if (this.orderModel.PLC == '') {
            this.orderModel.PLC = 0;
        }
        if (this.orderModel.InfraCharge == '') {
            this.orderModel.InfraCharge = 0;
        }
        if (orderModel.AgreedCost !== null) {
            this.orderModel.SubTotal = parseInt(this.orderModel.AgreedCost) + parseInt(this.orderModel.ParkingCharge) + parseInt(this.orderModel.FloorRise) + parseInt(this.orderModel.PLC) + parseInt(this.orderModel.InfraCharge);
            this.roundup('SubTotal');
        }
        this.onDiscountSchemeChange();
    }
    totalValue() {
        this.orderModel.TotalValue = this.orderModel.DiscountSubTotal - (Number(this.orderModel.TDS)) +
            (Number(this.orderModel.GST)) + (Number(this.orderModel.Tax)) + (Number(this.orderModel.StampDuty));
        this.roundup('TotalValue');
    }
    onTDSChange = (TdsPercent) => {
        //--------Calculate Total Value On TDS Change-------//
        this.orderModel.percentageTDS = TdsPercent;
        if (TdsPercent !== null) {
            this.orderModel.TDS = (this.orderModel.DiscountSubTotal * this.orderModel.percentageTDS) / 100;
            this.roundup('TDS');
            this.totalValue()
        }
    }
    roundup(modal) {
        this.orderModel[modal] = this.orderModel[modal] ? Math.round((this.orderModel[modal] + Number.EPSILON) * 100) / 100 : 0;
    }
    onStampDutyChange = (StampPercent) => {
        //--------Calculate Total Value On TDS Change-------//
        this.orderModel.PercentStampDuty = StampPercent;
        if (StampPercent !== null) {
            this.orderModel.StampDuty = (this.orderModel.DiscountSubTotal * this.orderModel.PercentStampDuty) / 100;
            // this.roundup('StampDuty');
            this.orderModel.StampDuty = Math.round(this.orderModel.StampDuty);
            this.totalValue()
        }
    }
    calculatePer(Amount, model) {
        if (Amount) {
            Amount = Number(Amount);
            this.orderModel[model] = (Amount / (model === 'percentageGST' ? this.orderModel.InfraCharge : this.orderModel.DiscountSubTotal)) * 100;
            // this.roundup(model);
            this.orderModel[model] = Math.round(this.orderModel[model]);
            this.totalValue();
        }
    }
    // Calculate Manually Entered Stamp Duty Amount 
    calculateStampDuty = (stampAmount) => {
        let stampAmt = Number(stampAmount);
        this.orderModel.TotalValue = this.orderModel.DiscountSubTotal + (stampAmt) + (Number(this.orderModel.GST)) + (Number(this.orderModel.Tax));
    }
    //--------Calculate Total Value On GST Change-------//
    onGSTChange = (GstPercent) => {
        this.orderModel.percentageGST = GstPercent;
        if (this.orderModel.ProjectType && this.orderModel.ProjectType === 'Plots' && this.orderModel.InfraCharge && GstPercent) {
            this.orderModel.InfraCharge = Number(this.orderModel.InfraCharge);
            this.orderModel.GST = (this.orderModel.InfraCharge * this.orderModel.percentageGST) / 100;
        } else if (GstPercent !== null) {
            this.orderModel.GST = (this.orderModel.DiscountSubTotal * this.orderModel.percentageGST) / 100;
        }
        this.totalValue();
        // this.roundup('GST');
        this.orderModel.GST = Math.round(this.orderModel.GST);
    }
    // Calculate Manually Entered Gst Amount 
    calculateGst = (gstAmount) => {
        let gstAmt = Number(gstAmount);
        this.orderModel.TotalValue = this.orderModel.DiscountSubTotal - (Number(this.orderModel.TDS)) + (gstAmt) + (Number(this.orderModel.Tax));
        this.roundup('TotalValue');
    }
    onTaxChange = (TaxPercent) => {
        //--------Calculate Total Value On TAX Change-------//
        if (TaxPercent !== null) {
            this.orderModel.Tax = Number(TaxPercent);
            this.roundup('GSTaxT');
            this.totalValue()
        }
    }
    OnPercentChange = (OnSelection) => {
        //--------Calculate Total Value On Percent Change-------//
        if (OnSelection) {
            this.orderModel.TotalValue = OnSelection
            this.roundup('TotalValue');
            this.totalValue()
        }
    }
    OnBookingDuePercentChange = (OnSelection) => {
        //--------Calculate Total Due On Percent Change-------//
        this.orderModel.TotalDue = OnSelection;
        if (OnSelection !== null) {
            this.orderModel.TotalDue = (this.orderModel.DiscountSubTotal * this.orderModel.TotalDuePercentage) / 100;
            this.roundup('TotalDue');
        }
    }
    jointName1Check = (jointName1) => {
        this.enablePan1 = jointName1.length > 0 ? true : false;
    }
    jointName2Check = (jointName2) => {
        this.enablePan2 = jointName2.length > 0 ? true : false;
    }
    onClickEditRate = () => {
        //--------hide Rate Edit Link Button On Click-------//
        this.hideEditButton = true;
    }
    onClickCancelRate = () => {
        //--------Show Rate Edit Link Button On Click Cancle-------//
        this.hideEditButton = false;
    }
    onUpdateRate = (orderModel) => {
        //--------Update Rate-------//
        this.hideEditRateButtonInitially = false;
        const UpdateRate = this.orderService.UpdateRate(orderModel, this.loggedInuserDetails).subscribe((response) => {
            if (response['successful']) {
                this.showUpdateRateSuccessfullMessage = "Rate Updated Successfully."
                this.showUpdateRateUnSuccessfullMessage = '';
                this.orderModel.percentageTDS = 0;
                this.orderModel.percentageGST = 0;
                this.orderModel.percentageTAX = 0;
                this.GetSelectedCarpetAreaList();
                this.CalculateAgreedCost(this.orderModel);
            } else {
                this.showUpdateRateUnSuccessfullMessage = "Rate Updation Failed."
                this.showUpdateRateSuccessfullMessage = '';
            }
            this._EventSubscription.push(UpdateRate);
            setTimeout(() => {
                this.showUpdateRateSuccessfullMessage = '';
                this.showUpdateRateUnSuccessfullMessage = '';
            }, 4000);
        });
    }
    showCompanyNameModel = (orderDetails) => {
        //--------Show Company Details Model-------//
        this.EnterCompanyName = '';
        this.EnterRERARegistrationNo = '';
        this.companyNameForInvoice = "Enter Company Name for Invoice :"
        this.popupCompanyNameModel.show();
        this.PDFOrderDetails = orderDetails;
    }
    openwindow = (url) => {
        window.open(url);
    }
    close = () => {
        //--------hide Company Details Model-------//
        this.popupCompanyNameModel.hide();
    }
    @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
        if (event.keyCode === 27) {
            this.close();
            this.summaryDetailsModel.hide();
        }
    }
    GeneratePDF = () => {
        //--------Generate PDF Pop-Up To Enter Company Details-------//     
        this.PDFOrderDetails.BookingHeadImage = this.pdfImageDetails.filter(x => x['ProjectId'] === this.PDFOrderDetails['ProjectId']).map(x => { return x['FileURL'] })[0];
        this.orderPdfService.download(this.PDFOrderDetails, this.EnterCompanyName, this.EnterRERARegistrationNo, null);
        this.popupCompanyNameModel.hide();
        this.EnterCompanyName = '';
        this.EnterRERARegistrationNo = '';
    }

    onChangeDate = (selectedDateRange) => {
        if (selectedDateRange != undefined && selectedDateRange.startDate != null && selectedDateRange.endDate != null) {
            //********* when date range change *********//         
            this.StartDate = selectedDateRange.startDate._d.toLocaleDateString();
            this.EndDate = selectedDateRange.endDate._d.toLocaleDateString();
            this.getOrderSummary(this.StartDate, this.EndDate)
            //********* End *********// 
        }
    }

    getOrderSummary = (startDate, endDate) => {
        //*********  Todays all Issues information in grid *********//       
        this.isLoading = true;
        const SelectOrderSummary = this.orderService.SelectOrderSummary(this.loggedInuserDetails, startDate, endDate).subscribe((response) => {
            if (response && response["data"][0] && response["data"][0].length > 0) {
                this.TableDataSales = response["data"][0];
                this.TableDataProject = response["data"][1];
                this.TotalOrders = response["data"][2][0]["Total"];
                this.TotalOrdersByPresales = response["data"][4][0]["Total"];
                this.tabledataPreSales = response["data"][3];
                if (this.TotalOrders && this.TotalOrders !== 0) {
                    this.getheaderSales = Object.keys(this.TableDataSales[0]);
                    this.getheaderSales.shift();
                    this.getheaderSales.shift();
                    this.getheaderByProject = Object.keys(this.TableDataProject[0]);
                    this.getheaderByProject.shift();
                    this.getheaderByProject.shift();
                    this.TableDataSales = this.getTotalCountbyMonth(this.TableDataSales);
                    this.SessionCreate();
                }
                if (this.TotalOrdersByPresales && this.TotalOrdersByPresales !== 0) {
                    this.getheaderPreSales = Object.keys(this.tabledataPreSales[0]);
                    this.getheaderPreSales.shift();
                    this.getheaderPreSales.shift();
                    this.TableDataProject = this.getTotalCountbyMonth(this.TableDataProject);
                    this.tabledataPreSales = this.getTotalCountbyMonth(this.tabledataPreSales);
                    this.tabledataPreSales.forEach(element => {
                        if (element.ColName === 'Total') {
                            element.Total = this.TotalOrdersByPresales;
                        }
                    });
                    this.SessionCreate();
                }
                this.noDataMsg = '';
            } else {
                // this.OrderDetailsBySales = [];
                this.TableDataSales = [];
                this.TableDataProject = [];
                this.TotalOrders = 0;
                this.getheaderSales = [];
                this.getheaderByProject = [];
                this.getheaderPreSales = [];
                this.tabledataPreSales = [];
                this.noDataMsg = 'No data found for selected Date ranges';
            }
            this.isLoading = false;
        });
        this._EventSubscription.push(SelectOrderSummary);
        //********* End *********//
    }

    // ********* Get Total ReferralId ************* //
    getTotalLead = () => {
        this.SummaryDetails.map(element => {
            this.TotalReferralId.push(element.ReferralId);
        });
    }
    // ********* Shared Service to go to Enquiry Details ************* //
    showDetails = (details) => {
        this.getTotalLead();
        details.LeadId = details.ReferralId;
        details.allId = this.TotalReferralId;
        details.tabNo = `tab15`;
        details.LeadId ? this.sharedService.allLeadSearchDetails(details) : null;
    }

    getTotalCountbyMonth = (details) => {
        details.forEach(element => {
            let total = 0;
            let columnName = Object.keys(element);
            columnName.forEach(item => {
                let data = this.filterStatus.filter(x => x.key === item.toLocaleLowerCase());
                if (data.length > 0) {
                    total += element[item] ? element[item] : 0;
                }
            });
            element['Total'] = total;
        });
        let TotalCount = [];
        TotalCount.push({ ColName: 'Total' });
        this.filterStatus.map(element => {
            let sum = 0;
            sum = details.reduce((a, b) => +a + +b[element.value], 0);
            TotalCount[0][element.value] = sum;
        });
        details.push(TotalCount[0]);
        details.forEach(element1 => {
            let index = details.findIndex(x => x.ColName === 'Total');
            if (index !== -1) {
                details[index].Total = this.TotalOrders;
            }
        });
        return details;
    }

    getOrderSummaryDetails = (details) => {
        //*********  Todays all Issues information in grid *********/
        const SelectOrderSummaryDetailsSubscription = this.orderService.SelectOrderSummaryDetails(this.loggedInuserDetails, this.StartDate, this.EndDate, details).subscribe((response) => {
            if (response && response["data"][0] && response["data"][0] && response["data"][0].length > 0) {
                this.SummaryDetails = response["data"][0];
                if (response["data"][1].length > 0) {
                    this.SummaryByBuilding = response["data"][1];
                }
                this.noDataMsg = '';
                this.p1 = 1;
                this.detailsbybuilding = 1;
                this.summaryDetailsModel.show();
            } else {
                // this.OrderDetailsBySales = [];
                this.noDataMsg = 'No data found for selected Date ranges';
            }
            this._EventSubscription.push(SelectOrderSummaryDetailsSubscription);
        });
        //********* End *********//
    }

    showDetailsPopUp = (details, type, input) => {
        this.isLoading = true;
        if (type === 'Open' && details.ColName != 'Total') {
            this.SumProjectName = (input === 'Project') ? details.ColName : details.ColName;
            this.getOrderSummaryDetails(details);
            this.summaryDetailsModel.show();
        } else {
            this.summaryDetailsModel.hide();
            this.SummaryDetails = [];
            this.SummaryByBuilding = [];
        }
        this.isLoading = false;
    }
    switchToSummery() {
        //********* Switch between (Todays all lead information in grid & Marketing Analysis*********//
        if (this.Count === 0) {
            this.Count = 1;
            this.SwitchSummeryName = ' Hide Summary';
            this.Showsummery = true;
            this.StartDate = moment();
            this.EndDate = moment();
        } else {
            this.Count = 0;
            this.Showsummery = false;
            this.SwitchSummeryName = ' Show Summary';
        }
        this.SessionCreate();
        //********* End *********//
    }

    // **** Find Booking Percentage **** //
    onBookingPercentage = (BookingPercentage: number) => {
        let amt = this.orderModel.DiscountSubTotal;
        this.orderModel.BookingAmountForPercentage = (BookingPercentage * amt) / 100;
        this.orderModel.bookingInfra = BookingPercentage * this.orderModel.InfraCharge / 100;
    }
    // cancelOrder = () => {
    //     this.showCancelOrder = true;
    // }
    //****** Open File in new tab******//
    OpenFile = (url) => {
        window.open(url);
    }

    isInvalidDate = (m: moment.Moment) => {
        //-----if invalid date is selected-----//
        return this.invalidDates.some(d => d.isSame(m, 'day'))
        //-----End-----//
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    //** action for ng On Destroy  **/
    ngOnDestroy() {
        for (let item of this._EventSubscription) {
            item.unsubscribe();
        }
    }
}