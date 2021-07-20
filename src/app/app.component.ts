import { Component, HostListener, ViewChild } from '@angular/core';
import { SharedService } from './shared/services/shared/shared.service';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { SignUpService } from 'src/app/shared/services/signup/sign-up.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public idleState: string;
  public routePath: string;
  public lastPing?: Date = null;
  title = 'Tru-UI';
  @ViewChild('form', { static: false }) public idelModal: any;
  constructor(
    private sharedService: SharedService, private signUpService: SignUpService,
    public idle: Idle,
    public keepalive: Keepalive,
    public router: Router) {
    // sets an idle timeout of 10 Minutes, for testing purposes.
    idle.setIdle(600);

    // sets a timeout period of 45 minutes. after 2 minutes of inactivity, the user will be considered timed out.
    idle.setTimeout(120);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idelModal.hide();
    });

    idle.onTimeout.subscribe(() => {
      this.routePath = this.router.url;
      if (this.router.url !== '/login' && this.router.url !== '/signup') {
        this.expireSession();
      }
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      if (this.router.url !== '/login' && this.router.url !== '/signup') {
        this.idleState = 'You will time out in ' + countdown + ' seconds!'
        this.idelModal.show();
      }
    });

    // sets the ping interval to 30 Minutes
    keepalive.interval(30000);

    keepalive.onPing.subscribe(() => {
      if (this.router.url !== '/login' && this.router.url !== '/signup') {
        this.lastPing = new Date();
        this.extendSession();
      }
    });
    this.reset();
  }
  // Clear the General Search List on "On Click"
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    this.sharedService.cancelGenralSearch();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    alert(event.returnValue = "You are trying to leave this page! Your Data will lost!!!");
  }

  reset() {
    this.idle.watch();
  }

  continueSession = () => {
    this.idelModal.hide();
  }

  expireSession = () => {
    this.signUpService.logoutDetails(JSON.parse(localStorage.getItem('LoggedinUser')), 'LOGOUT').subscribe((response) => {
      if (response) { }
    });
    if (this.routePath.includes('finance')) {
      this.router.navigate(['/finance']);
    } else {
      this.router.navigate(['/login']);
    }
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('LoggedinUser');
    sessionStorage.clear();
    this.idelModal.hide();
    this.router.navigate(['/login']);
  }

  // for Extend the Session automatically every 45 minutes
  extendSession = () => {
    this.sharedService.extendSession().subscribe((data) => {
      if (data) {
        let LoggedinUser = JSON.parse(localStorage.getItem("LoggedinUser"));
        LoggedinUser.token = data;
        localStorage.setItem("LoggedinUser", JSON.stringify(LoggedinUser));
      }
    });
  }
  ngOnInit() {
  }
  onRightClick(event) {
    return false;
  }
  // @HostListener('window: beforeunload', ['$event'])
  // public beforeunloadHandler($event) {
  //   if (window.performance.navigation.type != 1) {
  //     $event.returnValue = "Do you want to close?"
  //     localStorage.removeItem('isLoggedin');
  //     localStorage.removeItem('LoggedinUser');
  //     this.idelModal.hide();
  //     this.sharedService.shareLogoutActivity();
  //   }
  // }

  @HostListener('window: beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    if (this.router.url !== '/community' || this.routePath.includes('finance')) {
      if (window.performance.navigation.type != 1) {
        this.signUpService.logoutDetails(JSON.parse(localStorage.getItem('LoggedinUser')), 'LOGOUT').subscribe((response) => {
          if (response) { }
        });
        $event.returnValue = "Do you want to close?"
        localStorage.removeItem('isLoggedin');
        localStorage.removeItem('LoggedinUser');
        this.idelModal.hide();
        this.sharedService.shareLogoutActivity();
      }
    }
  }
}
