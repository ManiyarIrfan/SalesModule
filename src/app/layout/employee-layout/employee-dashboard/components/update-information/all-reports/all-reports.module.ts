import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllReportsComponent } from './all-reports.component';
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { MenubarModule } from 'primeng/menubar';
import { ModalModule } from 'ngx-bootstrap';
import { MaterialModule } from 'src/app/material-module';

// lead report
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabViewModule } from 'primeng/tabview';
import { SubTabCallComponent } from './main-tabs/sub-tab-call/sub-tab-call.component';

// Call Combine-Reports For Subtab
import { IncomingDailyComponent } from './main-tabs/sub-tab-call/incoming-call-reports/incoming-daily/incoming-daily.component';
import { IncomingHourlyComponent } from './main-tabs/sub-tab-call/incoming-call-reports/incoming-hourly/incoming-hourly.component';
import { SubTabCallOutgoingComponent } from './main-tabs/sub-tab-call-outgoing/sub-tab-call-outgoing.component';
import { OutgoingCallReportsComponent } from './main-tabs/sub-tab-call-outgoing/outgoing-call-reports/outgoing-call-reports.component';
import { OutgoingDailyComponent } from './main-tabs/sub-tab-call-outgoing/outgoing-call-reports/outgoing-daily/outgoing-daily.component';
import { OutgoingHourlyComponent } from './main-tabs/sub-tab-call-outgoing/outgoing-call-reports/outgoing-hourly/outgoing-hourly.component';
import { SubTabCallSalesPerformComponent } from './main-tabs/sub-tab-call-sales-perform/sub-tab-call-sales-perform.component';
import { SalesPerformCallReportComponent } from './main-tabs/sub-tab-call-sales-perform/sales-perform-call-report/sales-perform-call-report.component';
import { SubTabCallCallStatsComponent } from './main-tabs/sub-tab-call-call-stats/sub-tab-call-call-stats.component';
import { IncomingCallReportsComponent } from './main-tabs/sub-tab-call/incoming-call-reports/incoming-call-reports.component';
import { CallStatsReportsComponent } from './main-tabs/sub-tab-call-call-stats/call-stats-reports/call-stats-reports.component';
import { CallStatsSalesComponent } from './main-tabs/sub-tab-call-call-stats/call-stats-reports/call-stats-sales/call-stats-sales.component';
import { CallStatsTeamComponent } from './main-tabs/sub-tab-call-call-stats/call-stats-reports/call-stats-team/call-stats-team.component';
import { SalesPerformSalesComponent } from './main-tabs/sub-tab-call-sales-perform/sales-perform-call-report/sales-perform-sales/sales-perform-sales.component';
import { SalesPerformPresalesComponent } from './main-tabs/sub-tab-call-sales-perform/sales-perform-call-report/sales-perform-presales/sales-perform-presales.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
// Call Main Report .......
import { SiteVisitedPerformanceComponent } from './main-tabs/site-visited-performance/site-visited-performance.component';
import { SiteVisitedReportsComponent } from './main-tabs/site-visited-performance/site-visited-reports/site-visited-reports.component';
import { SiteVisitSalesComponent } from './main-tabs/site-visited-performance/site-visited-reports/site-visit-sales/site-visit-sales.component';
import { SiteVisitTeamComponent } from './main-tabs/site-visited-performance/site-visited-reports/site-visit-team/site-visit-team.component';
import { SiteVisitInitiatedbyComponent } from './main-tabs/site-visited-performance/site-visited-reports/site-visit-initiatedby/site-visit-initiatedby.component';
import { SubTabDuplicateLeadComponent } from './main-tabs/sub-tab-duplicate-lead/sub-tab-duplicate-lead.component';
import { CpDuplicateLeadsComponent } from './main-tabs/sub-tab-duplicate-lead/cp-duplicate-leads/cp-duplicate-leads.component';
import { SubTabLeadBystatusComponent } from './main-tabs/sub-tab-lead-bystatus/sub-tab-lead-bystatus.component';
import { SubTabLeadByprojectComponent } from './main-tabs/sub-tab-lead-byproject/sub-tab-lead-byproject.component';
import { SubTabLeadBysourceComponent } from './main-tabs/sub-tab-lead-bysource/sub-tab-lead-bysource.component';
import { SubTabLeadBycampaignComponent } from './main-tabs/sub-tab-lead-bycampaign/sub-tab-lead-bycampaign.component';
import { SubTabMissedcallAnalysisComponent } from './main-tabs/sub-tab-missedcall-analysis/sub-tab-missedcall-analysis.component';
import { SubTabConversationComponent } from './main-tabs/sub-tab-conversation/sub-tab-conversation.component';
import { SubTabOneDayCallComponent } from './main-tabs/sub-tab-one-day-call/sub-tab-one-day-call.component';
import { SubTabEnquiryUntouchedAnalysisComponent } from './main-tabs/sub-tab-enquiry-untouched-analysis/sub-tab-enquiry-untouched-analysis.component';
import { SubTabUnqualifiedLeadanalysisComponent } from './main-tabs/sub-tab-unqualified-leadanalysis/sub-tab-unqualified-leadanalysis.component';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { ChartsModule } from 'src/app/shared/charts-components/charts.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BarRatingModule } from "ngx-bar-rating";
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MenubarModule,
        NgxDaterangepickerMd,
        NgbModule,
        TabViewModule,
        SharedComponentModule,
        ChartsModule,
        MultiSelectModule,
        DropdownModule,
        NgxPaginationModule,
        ModalModule,
        MaterialModule,
        BarRatingModule,
        CKEditorModule
    ],
    exports: [AllReportsComponent],
    declarations: [
        IncomingDailyComponent,
        IncomingHourlyComponent,
        SubTabCallOutgoingComponent,
        OutgoingCallReportsComponent,
        OutgoingDailyComponent,
        OutgoingHourlyComponent,
        SubTabCallSalesPerformComponent,
        SalesPerformCallReportComponent,
        SubTabCallCallStatsComponent,
        IncomingCallReportsComponent,
        CallStatsReportsComponent,
        CallStatsSalesComponent,
        CallStatsTeamComponent,
        SalesPerformSalesComponent,
        AllReportsComponent,
        MainTabsComponent,
        SubTabCallComponent,
        SiteVisitedPerformanceComponent,
        SiteVisitedReportsComponent,
        SiteVisitSalesComponent,
        SiteVisitTeamComponent,
        SiteVisitInitiatedbyComponent,
        SubTabDuplicateLeadComponent,
        CpDuplicateLeadsComponent,
        SubTabLeadBystatusComponent,
        SubTabLeadByprojectComponent,
        SubTabLeadBysourceComponent,
        SubTabLeadBycampaignComponent,
        SalesPerformPresalesComponent,
        SubTabMissedcallAnalysisComponent,
        SubTabConversationComponent,
        SubTabOneDayCallComponent,
        SubTabEnquiryUntouchedAnalysisComponent,
        SubTabUnqualifiedLeadanalysisComponent
    ]
})
export class AllReportsModule { }
