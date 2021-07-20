import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpReportService {

  constructor(private http: HttpClient) { }
  GetReportForPipelineAnalysis = (user, dates, reportingName, subReportName) => {
    const url = `${environment.empApiUrl}api/Reporting/GetReportForPipelineAnalysis/UserId,EntityId,UserType,StartDate,EndDate,ReportName,SubReportName,Role,Level?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&ReportName=${reportingName}&SubReportName=${subReportName}&Role=${user.Role}&Level=${user.Level}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetReportForPipelineAnalysisDetails = (user, dates, reportingName, subReportName) => {
    const url = `${environment.empApiUrl}api/Reporting/GetReportForPipelineAnalysisDetails/UserId,EntityId,UserType,StartDate,EndDate,ReportName,SubReportName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&ReportName=${reportingName}&SubReportName=${subReportName}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetReportForSiteVisitBySalesDetails = (user, dates, reportingName) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformance/UserId,EntityId,UserType,StartDate,EndDates,ReportName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&Status=${reportingName}`;
    return this.http.get(url).pipe(map(x => x));
  };
  // Calling Service for Call Reports
  GetCallReportDetails = (user, dates, ReportName, SubReportName, Option, Name) => {
    const url = `${environment.empApiUrl}api/Reporting/GetCallReport/UserId,EntityId,UserType,StartDate,EndDate,ReportName,SubReportName,Option,Name,level?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&ReportName=${ReportName}&SubReportName=${SubReportName}&Option=${Option}&Name=${Name}&level=${user.Level}`;
    return this.http.get(url).pipe(map(x => x));
  };
  // End Service
  /*Sales Performance*/
  GetReportForLeadStageAgainstSales = (user, dates, reportingName) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformanceLeadStaticsagainstsales/UserId,EntityId,UserType,StartDate,EndDate,Status,Level?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&Status=${reportingName}&Level=${user.Level}&EntityId=${user.EntityId}`;
    return this.http.get(url).pipe(map(x => x));
  };
  GetReportForFollowupPerformance = (user, dates, reportingName) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformanceFollowupBySales/UserId,EntityId,UserType,StartDate,EndDate,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&Status=${reportingName}`;
    return this.http.get(url).pipe(map(x => x));
  };
  GetReportForConducted = (user, dates) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformanceforConducted/UserId,EntityId,UserType,StartDate,EndDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}`;
    return this.http.get(url).pipe(map(x => x));
  };
  GetReportForbooking = (user, dates, reportingName) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformanceforBooking/UserId,EntityId,UserType,StartDate,EndDate,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&Status=${reportingName}`;
    return this.http.get(url).pipe(map(x => x));
  };
  GetReportForReassign = (user, dates, reportingName) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformanceLeadReAssigned/UserId,EntityId,UserType,StartDate,EndDate,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&Status=${reportingName}`;
    return this.http.get(url).pipe(map(x => x));
  };
  GetReportForSiteVisitSales = (user, dates, Status) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformance/UserId,EntityId,UserType,StartDate,EndDate,Status,Level?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&Status=${Status}&Level=${user.Level}&EntityId=${user.EntityId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetReportForPushToSales = (user, dates, Status) => {
    const url = `${environment.empApiUrl}api/Reporting/GetSalesPerformanceLeadPushedBySalesandPresales/UserId,EntityId,UserType,StartDate,EndDate,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dates.startDate.format('YYYY-MM-DD')}&EndDate=${dates.endDate.format('YYYY-MM-DD')}&Status=${Status}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getDuplicateRecords = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartnersReport/GetDuplicateLeadReport/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getReportNames = (user) => {
    const url = `${environment.empApiUrl}api/Reporting/GetEmployeeReportsName/UserId,EntityId,UserType,StartDate,EndDate,Level?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getExcelReport = (user, ReportName, dates, ProjectId) => {
    const url = `${environment.empApiUrl}api/Reporting/ExportEmployeeReport/UserId,EntityId,UserType,FromDate,ToDate,ReportName,Level?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ReportName=${ReportName}&FromDate=${dates.StartDate}&ToDate=${dates.EndDate}&ProjectId=${ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllLeadDetails = (user, ReportName, dates) => {
    const url = `${environment.empApiUrl}api/Reporting/LeadAnalysisReport/UserId,EntityId,UserType,FromDate,ToDate,ReportName,Role,ProjectId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Role=${user.Role}&ReportName=${ReportName}&FromDate=${dates.startDate.format('YYYY-MM-DD')}&ToDate=${dates.endDate.format('YYYY-MM-DD')}&ProjectId=${dates.ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  LeadWiseBookingDetails = (user, dates) => {
    const url = `${environment.empApiUrl}api/Reporting/LeadAnalysis_SiteVisitAndBooking_Report/UserId,EntityId,UserType,FromDate,ToDate,ProjectId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${dates.startDate.format('YYYY-MM-DD')}&ToDate=${dates.endDate.format('YYYY-MM-DD')}&ProjectId=${dates.ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getLeadAnalysisDetailsReport = (user, empModel) => {
    const url = `${environment.empApiUrl}api/Reporting/LeadAnalysisDetailsReport/UserId,EntityId,UserType,FromDate,ToDate,ReportName,Role,ProjectId?UserId=${user.UserId}&EntityId=${empModel.EmpId}&UserType=${user.UserType}&Role=${user.Role}&ReportName=${empModel.ReportName}&FromDate=${empModel.FromDate}&ToDate=${empModel.ToDate}&Option=${empModel.Option}&ProjectId=${empModel.ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getSitevisitReportDetails = (user, empModel) => {
    const url = `${environment.empApiUrl}api/Reporting/LeadAnalysis_SiteVisitAndBookingDetail_Report/UserId,EntityId,UserType,FromDate,ToDate,ProjectId?UserId=${user.UserId}&EntityId=${empModel.EmpId}&UserType=${user.UserType}&EmployeeId=${empModel.EmpId}&FromDate=${empModel.FromDate}&ToDate=${empModel.ToDate}&Input=${empModel.Option}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getmissedCallDetails = (user, direction, dates) => {
    const url = `${environment.empApiUrl}api/Reporting/MissedCallAnalysisReport/UserId,EntityId,UserType,FromDate,ToDate,Direction?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${dates.startDate.format('YYYY-MM-DD')}&ToDate=${dates.endDate.format('YYYY-MM-DD')}&Direction=${direction}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getConversationDetails = (user, typeModel) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/EmployeeConversation/UserId,EntityId,UserType,ReportType,Status,ToDate,FromDate?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&ReportType=${typeModel.ReportType}&Status=${typeModel.Status}&FromDate=${typeModel.FromDate}&ToDate=${typeModel.ToDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getMasterData = (user, Input, CallId) => {
    const url = `${environment.empApiUrl}api/DPMPresale/GetCallRatingValues/UserId,UserType,EntityId?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&Input=${Input}&CallId=${CallId}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertUpdatecallrating = (user, data, Id, ratingDetails) => {
    let insertData = {
      callId: data.CallId,
      crSubMasterId: Id,
      remark: data.Remark,
      score: ratingDetails,
      id: user.UserId,
      entityId: data.EntityId, // referral or enquiry
      userType: data.UserType, // referral or enquiry
      creatorId: user.EntityId,
      creatorUserType: user.UserType,
      autoFail1: data.AutoFail1 ? data.AutoFail1 : false,
      autoFail2: data.AutoFail2 ? data.AutoFail2 : false
    }
    let url = `${environment.empApiUrl}api/DPMPresale/InsertUpdate_CallRating/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, insertData).pipe(map(x => x), take(1));
  }
  getFirstLastCall = (user, CurrentDate) => {
    const url = `${environment.empApiUrl}api/Reporting/FirstAndLastCallReport/UserId,EntityId,UserType,CurrentDate?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&CurrentDate=${CurrentDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getUntouchedAnalysis = (user, dates) => {
    const url = `${environment.empApiUrl}api/Reporting/UntouchedEnquiryAnalysisReport/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&FromDate=${dates.startDate.format('YYYY-MM-DD')}&ToDate=${dates.endDate.format('YYYY-MM-DD')}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getUntouchedAnalysisDetail = (user, empModel, dates) => {
    const url = `${environment.empApiUrl}api/Reporting/UntouchedEnquiryAnalysisDetailReport/UserId,EntityId,UserType,FromDate,ToDate,Input?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${empModel.EmployeeId}&FromDate=${dates.startDate.format('YYYY-MM-DD')}&ToDate=${dates.endDate.format('YYYY-MM-DD')}&Input=${empModel.Input}`;
    return this.http.get(url).pipe(map(x => x));
  }
  callObservation = (user, LeadData) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/CallObservation/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${LeadData.EnquiryId}&UserType=${LeadData.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelectedLocation = (user, selectedLocation) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetProjectNames/UserId,EntityId,UserType,location?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&location=${selectedLocation}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getTypesService = (user, SearchModel) => {
    const url = `${environment.marketingApiUrl}api/Master/MarketingDropDownTypeDataSearchSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&KeyType=${SearchModel.KeyType}`;
    return this.http.get(url).pipe(map(x => x));
  };
  getEmailReportsService = (user, SearchModel) => {
    let data = {
      Input: SearchModel.Input,
      DateFrom: SearchModel.DateFrom,
      DateTo: SearchModel.DateTo,
      SubInput: SearchModel.SubInput,
      ProjectId: SearchModel.ProjectId
    }
    const url = `${environment.marketingApiUrl}api/Admin/SelectReportDataForEmail/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  };
  DownloadSendEmail(user, CreateModel) {
    let data = {
      Id: user.UserId,
      EntityId: user.EntityId,
      UserType: user.UserType,
      HtmlBody: CreateModel.HtmlBody,
      EmailId: CreateModel.EmailId,
      Subject: CreateModel.Subject,
      CC: CreateModel.CC
    }
    const url = `${environment.marketingApiUrl}api/Admin/ReportDataSendEmail/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1))
  };
}
