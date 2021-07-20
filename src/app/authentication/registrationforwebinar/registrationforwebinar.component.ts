import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';
import { IRegistrationModel } from 'src/app/shared/models/Authentication/signup.model';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-registrationforwebinar',
  templateUrl: './registrationforwebinar.component.html',
  styleUrls: ['./registrationforwebinar.component.scss']
})
export class RegistrationforwebinarComponent implements OnInit {
  public RegistrationModel: IRegistrationModel = <IRegistrationModel>{};
  public MessageFlag: boolean;
  public isEmailAvailable = true;
  public isLoading: boolean;
  public showemail: string;
  public isMobileAvailable = true;
  public hideEvnetImage: boolean;
  public showmobile: string;
  public LatestEventImage: string = '';
  public AllEventList: string[] = [];
  public LatestEventList: string[] = [];
  public UpcomingEventList: string[] = [];
  public PastEventList: string[] = [];
  public SelectedEventDetails: string[] = [];
  public UrlEvent: string[];
  public AllTypeEventList: string[] = []
  public MenuTitle: string = '';
  public SortedEventTitle: string = '';
  public EventStatus = [
    { value: 'Current Event', key: 'Current' },
    { value: 'Upcoming Event', key: 'Upcoming' },
    { value: 'Past Event', key: 'Past' }]

  public EventTypes = [
    { value: 'Online', key: 'Online' },
    { value: 'Offline', key: 'Offline' },
    { value: 'Portal', key: 'Portal Training' }]

  private _RegSubscription: Array<Subscription> = [];
  public UpcomingEventListFlag = false;
  public PastEventListFlag = false;
  public LatestEventListFlag = true;

  @ViewChild('RegistrationForm', { static: false }) public RegistrationForm: NgForm;
  @ViewChild('viewLargeModel', { static: false }) public viewLargeModel: ModalDirective;

  constructor(
    private _regService: SignUpService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.RegistrationModel.HideShowBtn = true;
    this.RegistrationModel['Input'] = 'GetEvents';
    const getImage = this._regService.registrationforWebinar(this.RegistrationModel)
      .subscribe((response) => {
        if (response && response['data'] && response['data'][0].length > 0) {
          this.AllTypeEventList = response['data'][0];
          this.AllEventList = response['data'][0];
          this.route.params.subscribe((params) => {
            if (params['eventName']) {
              this.getEvents(params['eventName']);
            }
          });
          this.LatestEventList = this.AllEventList.filter(x => ((x['EventStatus'] === 'Latest')));
          this.UpcomingEventList = this.AllEventList.filter(x => ((x['EventStatus'] === 'Upcoming')));
          this.PastEventList = this.AllEventList.filter(x => ((x['EventStatus'] === 'Past')));
          this.RegistrationModel.HideShowAll = true;
        }
      });
    this._RegSubscription.push(getImage);
  }

  // Hide Show Menu
  HideShowArrowFun = (Action) => {
    switch (Action) {
      case 'Status':
        this.RegistrationModel.HideShowArrow1 = !this.RegistrationModel.HideShowArrow1;
        break;
    }
  }

  // Get Event from URL
  getEvents(EventName) {
    if (EventName && EventName !== '') {
      this.LatestEventImage = this.AllEventList.filter(x => x['EventName'] === EventName)[0]['FileURL'];
      this.SelectedEventDetails = this.AllEventList.filter(x => x['EventName'] === EventName)[0] as any

      this.RegistrationModel.HideShowRegister = true;
      this.RegistrationModel['FirmNameFlag'] = this.SelectedEventDetails['EventType'] === 'Portal' ? true : false;
    }
  }

  // Register Client
  Register = (CurrentDetails: IRegistrationModel): void => {
    this.RegistrationModel.DisableBtn = true;
    this.isLoading = false;
    CurrentDetails['Input'] = 'Insert';
    CurrentDetails['EventName'] = this.SelectedEventDetails['EventName'] ? this.SelectedEventDetails['EventName'] : '';
    CurrentDetails['Body'] = this.SelectedEventDetails['Body'];
    CurrentDetails['Subject'] = this.SelectedEventDetails['Subject'];
    const InsertSubScription = this._regService.registrationforWebinar(CurrentDetails)
      .subscribe((response) => {
        if (response && response['successful'] === true) {
          this.MessageFlag = true;
          this.RegistrationModel = <IRegistrationModel>{};
        } else {
          this.MessageFlag = false;
        }
        this.RegistrationModel.HideShowBtn = false;
        this.hideEvnetImage = true;
        this.RegistrationModel.DisableBtn = false;
        this.RegistrationModel.HideShowRegister = true
        setTimeout(() => {
          this.ViewAllEvents();
        }, 8000);
      });
    this.isLoading = true;
    this._RegSubscription.push(InsertSubScription);
  }

  // Check Duplicate Email
  checkDuplicateEmail = (email, Input): void => {
    this.isEmailAvailable = true;
    if (email && email !== '') {
      var emailpattern: any = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$/;
      if (email && emailpattern.test(String(email).toLowerCase())) {
        this.showemail = "";
        let FinalData = [];
        FinalData['EmailId'] = email;
        FinalData['Type'] = Input;
        FinalData['Input'] = 'Verify';
        const VerifyEmail = this._regService.getValidation(FinalData)
          .subscribe((response) => {
            if (response && response["data"] && response["data"][0]) {
              this.isEmailAvailable = (response["data"][0][0].IsAvailable !== 'Available');
              this.showemail = this.isEmailAvailable ? response["data"][0][0].IsAvailable : '';
            }
          });
        this._RegSubscription.push(VerifyEmail);
      }
    }
  }

  // Check Duplicate Mobile
  checkDuplicateMobile = (mobile, Input): void => {
    this.isMobileAvailable = true;
    if (mobile && mobile !== '') {
      var mobilepattern: any = /^\d{10}$/;
      if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
        let FinalData = []
        FinalData['MobileNo'] = mobile;
        FinalData['Type'] = Input;
        FinalData['Input'] = 'Verify';
        const VerifyMobile = this._regService.getValidation(FinalData)
          .subscribe((response) => {
            if (response && response["data"] && response["data"][0]) {
              this.isMobileAvailable = (response["data"][0][0].IsAvailable !== 'Available');
              this.showmobile = this.isMobileAvailable ? response["data"][0][0].IsAvailable : '';
            }
          });
        this._RegSubscription.push(VerifyMobile);
      } else {
        this.showmobile = "";
      }
    }
  }

  // Click To Register
  getRegister = (SelectedEvents) => {
    this.RegistrationModel.HideShowRegister = true;
    this.LatestEventImage = SelectedEvents.FileURL;
    this.SelectedEventDetails = SelectedEvents;
    this.RegistrationModel['FirmNameFlag'] = this.SelectedEventDetails['EventType'] === 'Portal' ? true : false;
  }

  // Filter Events via Type
  FilterEvents = (EventType) => {
    let LatestEventTemp = [], UpcomingEventTemp = [], PastEventTemp = [];
    LatestEventTemp = this.AllEventList.filter(x => (x['EventType'] === EventType) && (x['EventStatus'] === 'Latest'));
    UpcomingEventTemp = this.AllEventList.filter(x => (x['EventType'] === EventType) && (x['EventStatus'] === 'Upcoming'));
    PastEventTemp = this.AllEventList.filter(x => (x['EventType'] === EventType) && (x['EventStatus'] === 'Past'));
    this.MenuTitle = EventType;
    switch (EventType) {
      case 'Online':
        this.RegistrationModel.HideShowAll = false;
        this.RegistrationModel.hidePreviousEvent = this.RegistrationModel.hideUpcomingEvent = false;
        this.RegistrationModel.hideNewEvent = true;
        this.LatestEventList = LatestEventTemp;
        this.UpcomingEventList = UpcomingEventTemp;
        this.PastEventList = PastEventTemp;
        break;
      case 'Offline':
        this.RegistrationModel.HideShowAll = false;
        this.RegistrationModel.hideNewEvent = true;
        this.RegistrationModel.hideUpcomingEvent = this.RegistrationModel.hidePreviousEvent = false;
        this.LatestEventList = LatestEventTemp;
        this.UpcomingEventList = UpcomingEventTemp;
        this.PastEventList = PastEventTemp;
        break;
      case 'Portal':
        this.RegistrationModel.HideShowAll = false;
        this.RegistrationModel.hideNewEvent = true;
        this.RegistrationModel.hidePreviousEvent = this.RegistrationModel.hideUpcomingEvent = false;
        this.LatestEventList = LatestEventTemp;
        this.UpcomingEventList = UpcomingEventTemp;
        this.PastEventList = PastEventTemp;
        break;
      case 'All':
        this.RegistrationModel.HideShowAll = true;
        this.RegistrationModel.hidePreviousEvent = this.RegistrationModel.hideUpcomingEvent = false;
        this.RegistrationModel.hideNewEvent = false;
        this.LatestEventList = this.AllEventList.filter(x => ((x['EventStatus'] === 'Latest')));
        this.UpcomingEventList = this.AllEventList.filter(x => ((x['EventStatus'] === 'Upcoming')));
        this.PastEventList = this.AllEventList.filter(x => ((x['EventStatus'] === 'Past')));
        this.AllTypeEventList = this.AllEventList;
        break;
    }
  }

  // Sort Event Details from Menu
  SortEvents = (event) => {
    this.SortedEventTitle = event ? event : event.key;
    switch (event.key || event) {
      case 'Current':
        if (this.RegistrationModel.HideShowAll === true) {
          this.AllTypeEventList = this.AllEventList.filter(x => (x['EventStatus'] === 'Latest'));
        } else {
          this.RegistrationModel.hideNewEvent = true;
          this.RegistrationModel.hideUpcomingEvent = this.RegistrationModel.HideShowAll = this.RegistrationModel.hidePreviousEvent = false;
        }
        break;
      case 'Upcoming':
        if (this.RegistrationModel.HideShowAll === true) {
          this.AllTypeEventList = this.AllEventList.filter(x => (x['EventStatus'] === 'Upcoming'));
        } else {
          this.RegistrationModel.hideUpcomingEvent = true;
          this.RegistrationModel.hidePreviousEvent = this.RegistrationModel.HideShowAll = this.RegistrationModel.hideNewEvent = false;
        }
        break;
      case 'Past':
        if (this.RegistrationModel.HideShowAll === true) {
          this.AllTypeEventList = this.AllEventList.filter(x => (x['EventStatus'] === 'Past'));
        } else {
          this.RegistrationModel.hidePreviousEvent = true;
          this.RegistrationModel.HideShowAll = this.RegistrationModel.hideUpcomingEvent = this.RegistrationModel.hideNewEvent = false;
        }
        break;
    }
  }

  // View All Event Screen
  ViewAllEvents = () => {
    this.RegistrationModel = <IRegistrationModel>{};
    this.AllTypeEventList = this.AllEventList;
    this.hideEvnetImage = false;
    this.isLoading = false;
    this.RegistrationModel.HideShowAll = true;
    this.RegistrationModel.HideShowRegister = false;
    this.RegistrationModel.HideShowBtn = true
  }

  // Go To Registration if Registration Failed
  GotoReg = (): void => {
    this.RegistrationModel.HideShowBtn = true;
    this.hideEvnetImage = false;
    this.isLoading = false;
  }

  // Get Event Image URL
  getBackground(item) {
    return { 'background-image': `url(${item.FileURL}` };
  }

  getImage(item) {
    return { 'background-image': `url(${item}` };
  }

  // Hide Show Events
  HideShowEvent(Type) {
    switch (Type) {
      case 'New':
        this.RegistrationModel.hideNewEvent = false;
        this.RegistrationModel.hidePreviousEvent = false;
        this.RegistrationModel.hideUpcomingEvent = false;
        break;
      case 'Previous':
        this.PastEventList = this.AllEventList.filter(x => x['EventStatus'] === 'Past')
        // this.RegistrationModel.hideNewEvent = true;
        this.RegistrationModel.hidePreviousEvent = !this.RegistrationModel.hidePreviousEvent;
        this.RegistrationModel.hideUpcomingEvent = false;
        break;
      case 'Upcoming':
        this.UpcomingEventList = this.AllEventList.filter(x => x['EventStatus'] === 'Upcoming')
        // this.RegistrationModel.hideNewEvent = true;
        this.RegistrationModel.hidePreviousEvent = false;
        this.RegistrationModel.hideUpcomingEvent = !this.RegistrationModel.hideUpcomingEvent;
        break;
    }
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    for (let item of this._RegSubscription) {
      item.unsubscribe();
    }
  }
}
