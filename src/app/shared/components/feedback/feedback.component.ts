import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { FeedbackService } from '../../services/shared/feedback.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  public videoextensions = ['mp4', 'mkv', 'avi', 'MTS', 'M2TS', 'TS', 'mov', 'wmv', 'flv', 'webm'];
  public displaySlider: boolean = true;
  public displaycustomerSlider: boolean;
  public ShowButton = false;
  public loggedInuserDetails: any = [];
  public storeloginDetails: any;
  public CurrentLoginDetails: any = [];
  public PresentationDetails: string[] = [];
  public slides: any = [];
  public displayselected: string = '';
  public FeedBackModel: any = {}
  @ViewChild('showVideopopup', { static: false }) public showVideopopup: ModalDirective;
  public showSuccessfullMessage: string = '';
  public showUnsuccessfullMessage: string = '';
  public vidplayer: any;
  public ImageList: any[] = [];
  public ShowContent: boolean;
  public CurrentExtension: string = '';
  public Flag: boolean;
  public PresentationVideo: string = '';

  constructor(
    private FeedbackService: FeedbackService,
    private sharedService: SharedService,
    private _elRef: ElementRef,
    private router: Router) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    var logindetails = JSON.parse(localStorage.LoggedinUser);
    this.storeloginDetails = this.CurrentLoginDetails = logindetails;
    this.storeloginDetails.flag = this.CurrentLoginDetails.Flag = 0;
    this.ShowButton = false;

    // this.displaySlider = this.loggedInuserDetails.UserType === 'Customer' ? false : true;
    // this.displaycustomerSlider = this.loggedInuserDetails.UserType === 'Customer' || this.loggedInuserDetails.UserType === 'Referral' ? true : false;        



  }

  ngAfterViewInit() {
    // this.PresentationDetails['Video'] = 'https://trushare.blob.core.windows.net/production/TRU%20Customer%20Portal%20Intro.mp4';
    // this.vidplayer = this._elRef.nativeElement.querySelector('video');
    // this.vidplayer.load();
    // if (this.loggedInuserDetails.flag >= 1) {
    // this.vidplayer.muted = true;
    // }
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    switch (this.loggedInuserDetails.UserType.toLocaleLowerCase()) {
      case "customer":
        this.slides = [{ key: '../../../assets/images/kekarav_layout.jpeg' }];
        break;
      case "referral":
        this.slides = [{ key: '../../../assets/images/kekarav_layout.jpeg' }];
        break;
      case "channelpartner":
        this.slides = [
          { key: '../../../assets/images/banner1_yourfriendscanmakeyoumoney.jpg' },
          { key: '../../../assets/images/Portal banner_CP referral_2.jpg' },
          { key: '../../../assets/images/kekarav_layout.jpeg' },
          { key: '../../../assets/images/Kekarav.gif' },
        ];
        break;
      case "cro":
        this.slides = [
          { key: '../../../assets/images/Kekarav_Century.jpg' },
          { key: '../../../assets//images/kekarav_layout.jpeg' },
          { key: '../../../assets/images/Kekarav.gif' },
        ];
        break;
    }

    // if (this.loggedInuserDetails.flag !== 1) {
    //   this.showVideopopup.show();
    //   this.vidplayer.muted = false
    //   this.loggedInuserDetails.flag = 1;
    //   localStorage.setItem('LoggedinUser', JSON.stringify(this.loggedInuserDetails));
    // }
    setTimeout(() => {
      this.ShowButton = true;
    }, 10000);

    if (this.loggedInuserDetails['flag'] !== 1) {



      const GetDocumentCategoryService = this.sharedService.getFileDetailServices(this.loggedInuserDetails, 'Phase 1 Login Model')
        .subscribe((response) => {
          if (response && response['data'] && response['data'][0].length > 0) {
            let Filelength, extension;
            if (response['data'][0].length > 1) {
              response['data'][0].map((item) => {
                Filelength = Number(item.DocumentURL.lastIndexOf('.'));
                extension = item.DocumentURL.substr(Filelength + 1)
                if (!this.videoextensions.find(x => extension.includes(x))) {
                  this.ImageList.push({ FileURL: item.DocumentURL });
                  this.ShowContent = true;
                }
              });
            } else {
              let CrrntURL;
              if ((response['data'][0] && response['data'][0][0])) {
                CrrntURL = (response['data'][0] && response['data'][0][0]) ? response['data'][0][0].DocumentURL : '';
                Filelength = Number(CrrntURL.lastIndexOf('.'));
                extension = CrrntURL.substr(Filelength + 1)
                this.CurrentExtension = extension;
                if (this.videoextensions.find(x => extension.includes(x))) {
                  this.Flag = true;
                  this.PresentationVideo = CrrntURL;
                  this.vidplayer = this._elRef.nativeElement.querySelector('video');
                } else {
                  // this.Flag = true;
                  // if (extension === 'pdf' || extension === 'PDF') {
                  //   this.PresentationVideo = CrrntURL + '#toolbar=0&navpanes=0&scrollbar=0';
                  //   console.log(this.PresentationVideo)
                  // } else {
                  this.Flag = false;
                  this.ImageList.push({ FileURL: CrrntURL });
                  // }
                }
                this.ShowContent = true;
              }
              // else {
              //   this.ShowContent = false;
              // }
            }
            if (this.ImageList.length === 0 && this.PresentationVideo === '') {
              this.showVideopopup.hide();
            }
            // this.ShowContent = true;
          } else {
            this.ShowContent = false;
            this.showVideopopup.hide();
          }
        });
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails['flag'] !== 1) {
        this.loggedInuserDetails['flag'] = 1;
        localStorage.setItem('LoggedinUser', JSON.stringify(this.loggedInuserDetails));
        // this.getConsultantDetails();
        if (this.CurrentLoginDetails.Flag === 0) {
          if (this.loggedInuserDetails['flag'] === 1) {
            // if (this.ImageList.length > 0 || this.PresentationVideo !== '') {
            this.showVideopopup.show();
            // }
            if (this.Flag === true && this.PresentationVideo !== '') {
              this.vidplayer.muted = true;
            }
            this.loggedInuserDetails['flag'] = 2;
          }
          if (this.loggedInuserDetails['flag'] >= 2) {
            if (this.Flag === true) {
              this.vidplayer.muted = false;
              this.vidplayer.load();
            }
          }
        }
        else {
          if (this.Flag === true) {
            this.vidplayer.muted = true;
            this.vidplayer.onpause = true;
          }
        }
        setTimeout(() => {
          this.ShowButton = true;
        }, 10000);
      }
      else {
        if (this.Flag === true) {
          this.vidplayer.muted = true;
          this.vidplayer.onpause = true
        }
        // this.PresentationVideo = '';
        // this.vidplayer = null;

      }
    }
  }
  // on sumit deedback
  OnFeedbackSubmit = (FeedbackForm) => {
    this.FeedBackModel['feedBackName'] = 'Kekarav Login Popup Feedback';
    this.FeedbackService.InsertFeedback(this.loggedInuserDetails, this.FeedBackModel).subscribe((response) => {
      if (response && response["successful"]) {
        this.showSuccessfullMessage = "Your valuable feedback submitted successfully, our sales person will get back to you soon";
      }
      else {
        this.showUnsuccessfullMessage = "Failed";
      }

      this.FeedBackModel = {};
      FeedbackForm.form.markAsPristine();
      FeedbackForm.form.markAsUntouched();
      setTimeout(() => {
        this.showSuccessfullMessage = '';
        this.showUnsuccessfullMessage = '';
      }, 5000);
    });
  }

  closeModel = () => {
    this.showVideopopup.hide();
    // if (this.Flag === true) {
    //   this.vidplayer.muted = true;
    // }
    this.CurrentLoginDetails.flag = 1;
  }

  // GiveFeedback = () => {
  //   this.router.navigate(['/customer/customerfeedback']);
  //   setTimeout(() => {
  //     this.showVideopopup.hide();
  //   }, 300);
  // }

  // // close popup
  // closePopup = () => {
  //   this.showVideopopup.hide();
  // }
  // hide and show ppt or video
  showVideoPPt = (input) => {
    this.displaySlider = false;
    // this.displaycustomerSlider = false;
    this.displayselected = input ? input : '';
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }
}
