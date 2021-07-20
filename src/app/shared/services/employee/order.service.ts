import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  GetPendingOrderApprovalDetails = (user) => {
    const url = `${environment.empApiUrl}api/CustomerOrder/GetOrderStatus/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetPaymentScheduleDetails = (user, GetOrderId, IsInvoice) => {
    const url = `${environment.empApiUrl}api/PaymentSchedule/GetById/UserId,EntityId,UserType,OrderId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&OrderId=${GetOrderId}&IsInvoice=${IsInvoice}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetFinancialStatusDetails = (user, orderModel, payment) => {
    const url = `${environment.empApiUrl}api/CustomerReceipt/GetCustomerReceipt/UserId,EntityId,UserType,OrderId,InstallmentNo?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&OrderId=${orderModel.OrderId}&InstallmentNo=${payment.InstallmentNo}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetBrokerId = (user, searchDetails) => {
    const url = `${environment.empApiUrl}api/CustomerOrder/GetBrokerAssigned/UserId,EntityId,UserType,Name,MobileNo,Email?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Name=${searchDetails.FirstName}&MobileNo=${searchDetails.MobileNo}&Email=${searchDetails.UserId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetSearchDetails = (user, orderModel, Input) => {
    let body = {
      CustomerName: orderModel.SearchCustomerName ? orderModel.SearchCustomerName : null,
      ProjectName: orderModel.SearchProjectName ? orderModel.SearchProjectName : null,
      BuildingType: orderModel.SearchBuildingType ? orderModel.SearchBuildingType : null,
      BookingDateFrom: orderModel.SearchBookingDateFrom ? orderModel.SearchBookingDateFrom : null,
      BookingDateTo: orderModel.SearchBookingDateTo ? orderModel.SearchBookingDateTo : null,
      BrokerId: orderModel.SearchBrokerId ? orderModel.SearchBrokerId : null,
      SalesAgentId: orderModel.SearchSalesAgentId ? orderModel.SearchSalesAgentId : null,
      uniqueSearchId: orderModel.UniqueSearchId ? orderModel.UniqueSearchId : null,
      OrderId: orderModel.OrderId ? orderModel.OrderId : null,
      input: Input
    }
    const url = `${environment.empApiUrl}api/CustomerOrder/GetOrders/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, body).pipe(map(x => x), take(1));
  }

  GetProjectListOnSelected = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetBuildingTypeOnSelectedProject = (user, selectedProject) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetBuildingType/UserId,EntityId,UserType,ProjectName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProject}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetBhkOnSelectedBuildingType = (user, orderModel) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAllBHK/UserId,EntityId,UserType,ProjectName,BuildingType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${orderModel.ProjectName}&BuildingType=${orderModel.BuildingType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetFlatNumberOnSelectedLayoutType = (user, orderModel) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetFlatNo/UserId,EntityId,UserType,ProjectName,BuildingType,BHK,LayoutType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${orderModel.ProjectName}&BuildingType=${orderModel.BuildingType}&BHK=${orderModel.BHK}&LayoutType=${orderModel.LayoutType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetCarpetAreaOnSelectedFlatNumber = (user, orderModel) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetFlatDetails/UserId,EntityId,UserType,ProjectName,BuildingType,BHK,LayoutType,FlatNo?&UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${orderModel.ProjectName}&BuildingType=${orderModel.BuildingType}&BHK=${orderModel.BHK}&LayoutType=${orderModel.LayoutType}&FlatNo=${orderModel.FlatNo}`;
    return this.http.get(url).pipe(map(x => x));
  }

  getAllParkingsonBuilding = (user, projectId, BuildingType) => {
    const url = `${environment.empApiUrl}api/CustomerOrder/ParkingDetailsOnBuildingType/UserId,EntityId,UserType,ProjectId,BuildingType?&UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectId=${projectId}&BuildingType=${BuildingType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  UpdateRate = (orderModel, user) => {
    let data = {
      id: user.UserId,
      projectName: orderModel.ProjectName,
      buildingType: orderModel.BuildingType,
      flatNo: orderModel.FlatNo,
      rate: orderModel.Rate
    }
    let url = `${environment.empApiUrl}/api/ProjectDetails/UpdateProjectDetailsRate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x));
  }

  InsertOrderDetails = (orderModel, user, ClientList, sessionModel, uploaddFileStampDuety, OrderPdfFile) => {
    let data = {
      customerOrderModel: {
        Id: ClientList.EntityId,
        TenantId: user.TenantId,
        UserType: ClientList.UserType,
        EmployeeId: sessionModel.EntityId,
        ProjectName: orderModel.ProjectName,
        ProjectType: user.ProjectType ? user.ProjectType : '',
        BuildingType: orderModel.BuildingType,
        LayoutType: orderModel.LayoutType ? orderModel.LayoutType : '',
        BHK: orderModel.BHK,
        FlatNo: orderModel.FlatNo,
        SalesAgentId: orderModel.SalesAgentId ? orderModel.SalesAgentId : '',
        BrokerId: orderModel.BrokerId ? orderModel.BrokerId : '',
        AgreedCost: orderModel.AgreedCost ? orderModel.AgreedCost : 0,
        TotalValue: orderModel.TotalValue ? orderModel.TotalValue : 0,
        BookingPercentage: orderModel.BookingPercentage ? orderModel.BookingPercentage : 0,
        BookingAmount: orderModel.BookingAmount ? orderModel.BookingAmount : 0,
        BookingAmountForPercentage: orderModel.BookingAmountForPercentage ? orderModel.BookingAmountForPercentage : 0,
        BookingDate: orderModel.BookingDate ? orderModel.BookingDate : '',
        DiscountScheme: orderModel.DiscountScheme ? orderModel.DiscountScheme : 0,
        Rate: orderModel.Rate,
        TotalDue: orderModel.TotalDue ? orderModel.TotalDue : 0,
        JointName1: orderModel.JointName1 ? orderModel.JointName1 : '',
        JointName2: orderModel.JointName2 ? orderModel.JointName2 : '',
        Source: orderModel.Source ? orderModel.Source : '',
        SourceDetails: orderModel.SourceDetails ? orderModel.SourceDetails : '',
        BankName: orderModel.BankName ? orderModel.BankName : '',
        BankExecutiveName: orderModel.BankExecutiveName ? orderModel.BankExecutiveName : '',
        PANNo1: orderModel.PANNo1 ? orderModel.PANNo1 : '',
        PANNo2: orderModel.PANNo2 ? orderModel.PANNo2 : '',
        PANNo3: orderModel.PANNo3 ? orderModel.PANNo3 : '',
        StampDuty: orderModel.StampDuty ? orderModel.StampDuty : '',
        RegistrationTax: orderModel.RegistrationTax ? orderModel.RegistrationTax : '',
        TDS: orderModel.TDS ? orderModel.TDS : 0,
        GST: orderModel.GST ? orderModel.GST : 0,
        PLC: orderModel.PLC ? orderModel.PLC : 0,
        Tax: orderModel.Tax ? orderModel.Tax : 0,
        ParkingCharge: orderModel.ParkingCharge ? orderModel.ParkingCharge : 0,
        FloorRise: orderModel.FloorRise ? orderModel.FloorRise : 0,
        InfraCharge: orderModel.InfraCharge ? orderModel.InfraCharge : 0,
        OrderStatus: orderModel.OrderStatus,
        Designation: orderModel.Designation ? orderModel.Designation : '',
        CompanyName: orderModel.CompanyName ? orderModel.CompanyName : '',
        PaymentMilestone: orderModel.PaymentMilestone ? orderModel.PaymentMilestone : '',
        AadharCard: orderModel.AadharCard ? orderModel.AadharCard : '',
        IncentiveProposed: orderModel.IncentiveProposed ? orderModel.IncentiveProposed : 0,
        IncentiveValue: orderModel.IncentiveValue ? orderModel.IncentiveValue : 0,
        DiscountSubTotal: orderModel.DiscountSubTotal ? orderModel.DiscountSubTotal : 0,
        LoanSanctionLetter: orderModel.LoanSanctionLetter ? orderModel.LoanSanctionLetter : '',
        LoanSanctionDate: orderModel.LoanSanctionDate ? orderModel.LoanSanctionDate : '',
        NOCIssued: orderModel.NOCIssued ? orderModel.NOCIssued : '',
        NOCIssuedDate: orderModel.NOCIssuedDate ? orderModel.NOCIssuedDate : '',
        MaintenanceDeposit: orderModel.MaintenanceDeposit ? orderModel.MaintenanceDeposit : 0,
        stampDutyCheckCollected: orderModel.StampDutyCheckCollected ? orderModel.StampDutyCheckCollected : '',
        orderRemark: orderModel.OrderRemark ? orderModel.OrderRemark : '',
        incentiveBasedOn: orderModel.BasicCost ? orderModel.BasicCost : '',
        GSTPercent: orderModel.percentageGST ? orderModel.percentageGST : '',
        LoadingPer: orderModel.LoadingPer ? orderModel.LoadingPer : '',
        chequeBankName: orderModel.ChequeBankName ? orderModel.ChequeBankName : '',
        chequeNumber: orderModel.ChequeNumber ? orderModel.ChequeNumber : '',
        chequeDate: orderModel.ChequeDate ? orderModel.ChequeDate : ''
      },
      file: uploaddFileStampDuety ? uploaddFileStampDuety : [],
      OrderPdfFile: OrderPdfFile ? OrderPdfFile : []
    }
    let url = `${environment.empApiUrl}api/CustomerOrder/AddOrders/UserId,EntityId,UserType,DeviceDetails?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  UpdateOrderDetails = (orderModel, user) => {
    let data = {
      Id: user.UserId,
      OrderId: orderModel.OrderId,
      DiscountScheme: orderModel.DiscountScheme ? orderModel.DiscountScheme : 0,
      TDS: orderModel.TDS ? orderModel.TDS : 0,
      GST: orderModel.GST ? orderModel.GST : 0,
      Tax: orderModel.Tax ? orderModel.Tax : 0,
      BookingAmount: orderModel.BookingAmount ? orderModel.BookingAmount : 0,
      Source: orderModel.Source ? orderModel.Source : '',
      IncentiveProposed: orderModel.IncentiveProposed ? orderModel.IncentiveProposed : 0,
      OrderStatus: orderModel.OrderStatus,
      LoanSanctionLetter: orderModel.LoanSanctionLetter ? orderModel.LoanSanctionLetter : '',
      LoanSanctionDate: orderModel.LoanSanctionDate ? orderModel.LoanSanctionDate : '',
      NOCIssued: orderModel.NOCIssued ? orderModel.NOCIssued : '',
      NOCIssuedDate: orderModel.NOCIssuedDate ? orderModel.NOCIssuedDate : '',
    }
    let url = `${environment.empApiUrl}api/CustomerOrder/UpdateOrderDetails/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

  UpdateAgreementStatus = (agreementStatusModel, orderModel, user, uploaddFileAgreement, deleteUrl, dbUrl, nocuploadFile, nocdeleteUrl, nocdbUrl, parkuploadFile, parkdeleteUrl, parkdbUrl) => {
    let data = {
      customerOrderAgreementModel: {
        OrderId: orderModel.OrderId ? orderModel.OrderId : null,
        AgreementStatus: agreementStatusModel.AgreementStatus ? agreementStatusModel.AgreementStatus : null,
        BookingDate: orderModel.BookingDate ? orderModel.BookingDate : null,
        AgreementDate: agreementStatusModel.AgreementDate ? agreementStatusModel.AgreementDate : null,
        RegistrationNo: agreementStatusModel.RegistrationNo ? agreementStatusModel.RegistrationNo : null,
        CorrespondenceAddress: agreementStatusModel.CorrespondenceAddress ? agreementStatusModel.CorrespondenceAddress : null,
        Remarks: agreementStatusModel.Remarks ? agreementStatusModel.Remarks : null,
        Id: user.UserId,
        parkingNo1: agreementStatusModel.ParkingId1,
        parkingNo2: agreementStatusModel.ParkingId2,
        location1: agreementStatusModel.Location1,
        location2: agreementStatusModel.Location2
      },
      file: uploaddFileAgreement ? uploaddFileAgreement : [],
      NocFile: nocuploadFile ? nocuploadFile : [],
      deleteFileUrl: deleteUrl ? deleteUrl : null,
      dbImageUrlList: dbUrl ? dbUrl : null,
      NocdeleteFileUrl: nocdeleteUrl ? nocdeleteUrl : null,
      NocDBImageUrlList: nocdbUrl ? nocdbUrl : null,
      parkingFile: parkuploadFile ? parkuploadFile : [],
      parkingdeleteFileUrl: parkdeleteUrl ? parkdeleteUrl : null,
      parkingDBImageUrlList: parkdbUrl ? parkdbUrl : null
    }
    let url = `${environment.empApiUrl}api/CustomerOrder/UpdateAgreementDetailsOrders/UserId,EntityId,UserType,DeviceDetails?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

  InsertPaymentSchedule = (paymentSchedule, orderModel, user) => {
    let data = {
      Id: user.UserId,
      OrderId: orderModel.OrderId ? orderModel.OrderId : '',
      TotalDemandRaised: paymentSchedule.TotalDemandRaised ? paymentSchedule.TotalDemandRaised : '',
      InstallmentNo: paymentSchedule.InstallmentNo ? paymentSchedule.InstallmentNo : '',
      MilestoneId: paymentSchedule.MilestoneId ? parseInt(paymentSchedule.MilestoneId) : null,
      Percentage: paymentSchedule.Percentage ? paymentSchedule.Percentage : '',
      TaxReceived: paymentSchedule.TaxReceived ? paymentSchedule.TaxReceived : '',
      Infra: paymentSchedule.InfraReceived ? paymentSchedule.InfraReceived : '',
      Status: paymentSchedule.Status ? paymentSchedule.Status : '',
      EstimatedBillingDate: paymentSchedule.EstimatedBillingDate ? paymentSchedule.EstimatedBillingDate : '',
      psId: paymentSchedule.PSId ? paymentSchedule.PSId : null,
      input: paymentSchedule.Action,
      customerStatus: paymentSchedule.CustomerStatus ? paymentSchedule.CustomerStatus : null,
      AdvancePaymentUsed: paymentSchedule.AdvancePaymentUsed ? paymentSchedule.AdvancePaymentUsed : null
    }
    let url = `${environment.empApiUrl}api/PaymentSchedule/Insert/UserId,EntityId,UserType,DeviceDetails?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  InsertFinancialStatusDetails = (formData: FormData, user) => {
    let url = `${environment.empApiUrl}api/CustomerReceipt/InsertCRImg/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, formData).pipe(map(x => x), take(1));
  }

  SelectOrderSummary = (user, startDate, endDate) => {
    let url = `${environment.empApiUrl}api/CustomerOrder/OrderSummary/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  SelectOrderSummaryDetails = (user, startDate, endDate, orderDetails) => {
    let url = `${environment.empApiUrl}api/CustomerOrder/OrderSummaryDetails/UserId,EntityId,UserType,FromDate,ToDate,ProjectId?UserId=${user.UserId}&EntityId=${orderDetails.EmpId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&ProjectId=${orderDetails.ProjectId}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  // private imageJwt() {
  //   if (localStorage.getItem('LoggedinUser')) {
  //     this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
  //     if (this.loggedInuserDetails && this.loggedInuserDetails.token) {
  //       let headers = new Headers({ 'Authorization': 'Bearer ' + this.loggedInuserDetails.token });
  //       // headers.append('Content-Type', 'application/json');
  //       headers.set('Accept', 'application/json');
  //       return new RequestOptions({ headers: headers });
  //     }
  //   }
  // }
  addVirtualPayment = (user, transactionDetails, input) => {
    let data = {
      entityId: transactionDetails.ReferredById ? transactionDetails.ReferredById : null,
      userType: transactionDetails.ReferredByType ? transactionDetails.ReferredByType : null,
      transactionId: transactionDetails.OrderId ? transactionDetails.OrderId : null,
      transactionType: transactionDetails.TransactionType ? transactionDetails.TransactionType : null,
      amount: transactionDetails.IncentiveValue ? transactionDetails.IncentiveValue : null,
      tenantId: user.TenantId,
      id: user.UserId,
      input
    }
    let url = `${environment.empApiUrl}api/TRUPay/InsertVirtualWallet?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  addActualPayment = (user, agreementDetails, input) => {
    const data = {
      orderId: agreementDetails.OrderId ? agreementDetails.OrderId : null,
      amount: agreementDetails.IncentiveValue ? agreementDetails.IncentiveValue : null,
      RegistrationNo: agreementDetails.RegistrationNo ? agreementDetails.RegistrationNo : null,
      tenantId: user.TenantId,
      id: user.UserId,
      input,
    }
    const url = `${environment.empApiUrl}api/TRUPay/InsertActualWallet`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  orderOcrDetails = (user, orderModel, ocrModel) => {
    let data = {
      orderId: orderModel.OrderId,
      orderStatus: ocrModel.OrderStatus ? ocrModel.OrderStatus : null,
      source: ocrModel.Source ? ocrModel.Source : null,
      sourceDetails: ocrModel.SourceDetails ? ocrModel.SourceDetails : null,
      bankName: ocrModel.BankName ? ocrModel.BankName : null,
      paymentMilestone: ocrModel.PaymentMilestone ? ocrModel.PaymentMilestone : null,
      companyName: ocrModel.CompanyName,
      designation: ocrModel.Designation,
      bankExecutiveName: ocrModel.BankExecutiveName,
      loanSanctionLetter: ocrModel.LoanSanctionLetter,
      loanSanctionDate: ocrModel.LoanSanctionDate,
      nocIssued: ocrModel.NOCIssued,
      nocIssuedDate: ocrModel.NOCIssuedDate,
      discountSubTotal: ocrModel.DiscountSubTotal,
      ocR1: ocrModel.OCR1,
      ocR2: ocrModel.OCR2,
      loanAmount: ocrModel.LoanAmount,
      entityId: user.EntityId,
      userType: user.UserType,
      id: user.UserId,
      totalTax: ocrModel.TotalTax,
      selfPercentage: ocrModel.SelfPercentage,
      bankPercentage: ocrModel.BankPercentage
    }
    let url = `${environment.empApiUrl}api/CustomerOrder/UpdateOrderOCRDetails/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  GetAllMilestoneData = (user, projectid) => {
    let url = `${environment.empApiUrl}api/ProjectStatus/GetPaymentMilestone/UserId?UserId=${user.UserId}&ProjectId=${projectid}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getDocumentCategoryService = (user, SearchModel) => {
    const url = `${environment.marketingApiUrl}api/Master/DocumentMaster_SearchAndSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}
    &Input=${SearchModel.Input}&DocType=${SearchModel.DocType}&DocId=${SearchModel.DocId}&StakeholderType=${SearchModel.StakeholderType}`;
    return this.http.get(url).pipe(map(x => x));
  };

}
