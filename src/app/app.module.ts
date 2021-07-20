import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap';
import { MaterialModule } from './material-module';
import { InterceptorService } from './shared/services/shared/interceptor.service';
import { SocialLoginModule } from './shared/services/social/sociallogin.module';
import { GoogleLoginProvider } from './shared/services/social/providers/google-login-provider';
import { FacebookLoginProvider } from './shared/services/social/providers/facebook-login-provider';
import { SocialAuthServiceConfig } from './shared/services/social/socialauth.service';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    HttpModule,
    ShowHidePasswordModule,
    AmazingTimePickerModule,
    NgxPaginationModule,
    ModalModule,
    MaterialModule,
    NgxSpinnerModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '486719665604-mvp9kf0m8fpfquc6igo68po2rchaal18.apps.googleusercontent.com'
            ),
          },
          // {
          //   id: GoogleLoginProvider.PROVIDER_ID,
          //   provider: new GoogleLoginProvider(
          //     '973792683286-lu0194e1cr97pdg7rbi5f1sp9fek8nqu.apps.googleusercontent.com'
          //   ),
          // },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2645030145571309'),
          },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('348939173220075'), // sumit
          // },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('2976478269113940'),
          // },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('686910802242562'),
          // },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }  
