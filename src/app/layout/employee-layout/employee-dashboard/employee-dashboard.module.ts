import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeDashboardRoutingModule } from './employee-dashboard-routing.module';
import { ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AllReportsModule } from './components/update-information/all-reports/all-reports.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from 'src/app/material-module';

import {
    SendEmailLeadInteractionComponent,
    DpmComponent,
    DpmadminComponent,
    EmpPaymentScheduleComponent,
    EmpFinancialStatusComponent,
    EmpAgreementStatusComponent,
    OrderComponent,
    SearchDetailsComponent,
    EmployeeAnalyticsComponent,
    ServiceRequestComponent,
    UpdateInformationComponent,
    EditServiceRequestComponent,
    EditViewDetailsComponent,
    ProjectComponent,
    ProjectDetailsComponent,
    ReferralGenerationComponent,
    ReferralStatusComponent,
    EmpDashboardComponent,
    EmpInteractionComponent,
    ViewDetailComponent,
    ProjectStatusComponent,
    CpPaymentStatusComponent,
    AdminPanelComponent,
    ChannelpartnerAdminControlComponent,
    PreSalesDashboardComponent,
    LeadDetailComponent,
    PreSalesLeadsComponent,
    CreateLeadInteractionComponent,
    ShowLeadInteractionComponent,
    SearchEnquiryComponent,
    OpportunityDetailsComponent,
    FileManagementComponent,
    CreateSalesInteractionComponent,
    ShowSalesInteractionComponent,
    PowerSalesDashboardComponent,
    CpDetailsComponent,
    ScheduledSiteVisitComponent,
    SearchOpportunityComponent,
    FrontDeskLeadStatusComponent,
    PresalesTrainingComponent,
    CroAdminDashboardComponent,
    IssueTrackComponent,
    LeaddetailsPopupComponent,
    OcrBankDetailsComponent,
    PaymentReceiptComponent,
    SalesAdminComponent
} from './components';
import { StatModule } from 'src/app/shared/modules/stat/stat.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DropdownModule } from 'primeng/dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    imports: [
        DropdownModule,
        NgxDaterangepickerMd,
        Ng2SearchPipeModule,
        NgbModule,
        AccordionModule.forRoot(),
        CommonModule,
        NgbCarouselModule,
        CarouselModule.forRoot(),
        NgbAlertModule,
        EmployeeDashboardRoutingModule,
        StatModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        NgxPaginationModule,
        NgSelectModule,
        CKEditorModule,
        SharedComponentModule,
        MenubarModule,
        InputSwitchModule,
        AllReportsModule,
        MultiSelectModule,
        CalendarModule,
        OverlayPanelModule,
        ToastModule,
        BsDatepickerModule,
        MaterialModule,
        NgxMatSelectSearchModule
    ],
    declarations: [
        SendEmailLeadInteractionComponent,
        DpmComponent,
        DpmadminComponent,
        EmployeeDashboardComponent,
        SearchDetailsComponent,
        EmployeeAnalyticsComponent,
        ServiceRequestComponent,
        UpdateInformationComponent,
        OrderComponent,
        EditServiceRequestComponent,
        EditViewDetailsComponent,
        ProjectComponent,
        ProjectDetailsComponent,
        ReferralGenerationComponent,
        ReferralStatusComponent,
        EmpDashboardComponent,
        EmpInteractionComponent,
        ViewDetailComponent,
        ProjectStatusComponent,
        EmpPaymentScheduleComponent,
        EmpFinancialStatusComponent,
        EmpAgreementStatusComponent,
        CpPaymentStatusComponent,
        AdminPanelComponent,
        ChannelpartnerAdminControlComponent,
        PreSalesDashboardComponent,
        LeadDetailComponent,
        PreSalesLeadsComponent,
        CreateLeadInteractionComponent,
        ShowLeadInteractionComponent,
        SearchEnquiryComponent,
        OpportunityDetailsComponent,
        FileManagementComponent,
        CreateSalesInteractionComponent,
        ShowSalesInteractionComponent,
        PowerSalesDashboardComponent,
        CpDetailsComponent,
        ScheduledSiteVisitComponent,
        SearchOpportunityComponent,
        FrontDeskLeadStatusComponent,
        PresalesTrainingComponent,
        CroAdminDashboardComponent,
        IssueTrackComponent,
        LeaddetailsPopupComponent,
        PaymentReceiptComponent,
        OcrBankDetailsComponent,
        SalesAdminComponent
    ]
})
export class EmployeeDashboardModule { }
