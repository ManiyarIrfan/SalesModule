import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { ReferralGenerationRoutingModule } from './referral-generation-routing.module';
import { ReferralGenerationComponent } from './referral-generation.component';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';

@NgModule({
    imports: [CommonModule, PageHeaderModule, ReferralGenerationRoutingModule, FormsModule, AmazingTimePickerModule],
    declarations: [ReferralGenerationComponent]
})
export class ReferralGenerationModule { }
