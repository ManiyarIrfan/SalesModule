import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RouterModule } from "@angular/router";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadModule } from 'primeng/primeng';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MaterialModule } from 'src/app/material-module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskReminderModalComponent } from './task-reminder-modal/task-reminder-modal.component';
import { IdeaModuleComponent } from './idea-module/idea-module.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FeedbackComponent } from './feedback/feedback.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BarRatingModule } from 'ngx-bar-rating';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PayWalletComponent } from './pay-wallet/pay-wallet.component';
import { CommunityFileUploadComponent } from './community-file-upload/community-file-upload.component';
import { WhatsappComponent } from "./whatsapp/whatsapp.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        FileUploadModule,
        ModalModule.forRoot(),
        NgbDropdownModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        MaterialModule,
        ReactiveFormsModule,
        MDBBootstrapModule,
        LayoutModule,
        OverlayPanelModule,
        BarRatingModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        NgbModule,
        CarouselModule
    ],
    declarations: [
        HeaderComponent,
        SidebarComponent,
        FileUploadComponent,
        TaskReminderModalComponent,
        IdeaModuleComponent,
        FeedbackComponent,
        CustomerFeedbackComponent,
        PayWalletComponent,
        CommunityFileUploadComponent,
        WhatsappComponent
    ],
    exports: [
        HeaderComponent,
        SidebarComponent,
        FileUploadComponent,
        FileUploadModule,
        TaskReminderModalComponent,
        IdeaModuleComponent,
        FeedbackComponent,
        CustomerFeedbackComponent,
        PayWalletComponent,
        CommunityFileUploadComponent,
        WhatsappComponent
    ]
})

export class SharedComponentModule { }