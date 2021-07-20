import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewProfileRoutingModule } from './view-profile-routing.module';
import { ViewProfileComponent } from './view-profile.component';
import { GoogleMapComponent } from "./google-map/google-map.component";
import { AgmCoreModule } from '@agm/core';
import { FlatDetailsComponent } from './flat-details/flat-details.component';
import { SearchProjectComponent } from './search-project/search-project.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MaterialModule } from 'src/app/material-module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
    imports: [NgxPaginationModule,
        CommonModule,
        PageHeaderModule,
        FormsModule,
        ViewProfileRoutingModule,
        MaterialModule,
        AgmCoreModule.forRoot({
            // please get your own API key here:
            // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
            apiKey: 'AIzaSyCjoaaiQuLpbU_CTyaejX-0AJUips2bU5U'//'AIzaSyByKaxPjMeKQy0JKZgzp8bvkft42u3Wqus'
        }),
        SharedComponentModule,
        ModalModule
    ],
    declarations: [ViewProfileComponent,
        GoogleMapComponent,
        FlatDetailsComponent,
        SearchProjectComponent]
})
export class ViewProfileModule { }
