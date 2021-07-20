import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'tru-main-tabs',
  templateUrl: './main-tabs.component.html',
  styleUrls: ['./main-tabs.component.scss']
})
export class MainTabsComponent implements OnInit {

  items: MenuItem[];
  public isSpinnerActive: boolean;
  public StartDate: any;
  public EndDate: any;
  public Heading: string;
  public loggedInuserDetails: any;
  public dateObj: any = {};
  public show: boolean;
  selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
  public ranges: any = {};
  public rangesforL1: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    // 'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };

  public rangesforL2: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  constructor(public router: Router) {
  }
  ngOnInit() {
    // get records from this month 
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.StartDate = new Date(y, m, 1);
    this.EndDate = new Date(y, m + 1, 0);
    // this.StartDate = this.StartDate ? this.StartDate.toLocaleDateString() : moment().startOf('month')['_d'].toLocaleDateString();
    // this.EndDate = this.EndDate ? this.EndDate.toLocaleDateString() : moment()['_d'].toLocaleDateString();    
    this.selectedDateRange = { startDate: moment(), endDate: moment() };
    //-----this show the Main Munu for Pipeline Enquiry Analysis,Sales Performance, call report and its submanu-----//
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        if (this.loggedInuserDetails.Role === 21) {
          this.items = [{
            label: 'Lead Analysis', command: (event) => {
            },
            items: [
              {
                label: 'By Status', command: (event) => {
                  this.Heading = 'Status';
                  this.onClickMenu();
                }
              },
              {
                label: 'By Project', command: (event) => {
                  this.Heading = 'Project';
                  this.onClickMenu();
                }
              },
              {
                label: 'By Source', command: (event) => {
                  this.Heading = 'Source';
                  this.onClickMenu();
                }
              },
              {
                label: 'By Campaign', command: (event) => {
                  this.Heading = 'Campaign';
                  this.onClickMenu();
                }
              }
            ]
          }];
        } else {
          this.items = [
            {
              label: 'Call Reports', command: (event) => {
              },
              items: [
                {
                  label: 'Incoming Calls', command: (event) => {
                    this.Heading = "Incoming";
                    this.onClickMenu();
                  }
                },
                {
                  label: 'Outgoing Calls', command: (event) => {
                    this.Heading = "Outgoing";
                    this.onClickMenu();
                  }
                },
                {
                  label: 'Call Stats', command: (event) => {
                    this.Heading = "Call_Stats";
                    this.onClickMenu();
                  }
                },
                {
                  label: 'First And Last Call', command: (event) => {
                    this.Heading = "OneDayCall";
                    this.onClickMenu();
                  }
                },
                {
                  label: 'Missed Call Analysis', command: (event) => {
                    this.Heading = "MissedCallAnalysis";
                    this.onClickMenu();
                  }
                },
                {
                  label: 'Performance', command: (event) => {
                    this.Heading = "Performance";
                    this.onClickMenu();
                  }
                }
              ]
            },
            {
              label: 'Lead Analysis', command: (event) => {
              },
              items: [
                {
                  label: 'By Status', command: (event) => {
                    this.Heading = 'Status';
                    this.onClickMenu();
                  }
                },
                {
                  label: 'By Project', command: (event) => {
                    this.Heading = 'Project';
                    this.onClickMenu();
                  }
                },
                {
                  label: 'By Source', command: (event) => {
                    this.Heading = 'Source';
                    this.onClickMenu();
                  }
                },
                {
                  label: 'By Campaign', command: (event) => {
                    this.Heading = 'Campaign';
                    this.onClickMenu();
                  }
                },
                {
                  label: 'Enquiry Untouched Analysis', command: (event) => {
                    this.Heading = "EnquiryUntouchedAnalysis";
                    this.onClickMenu();
                  }
                },
                {
                  label: 'Unqualified lead Analysis', command: (event) => {
                    this.Heading = "UnqualifiedLeadAnalysis";
                    this.onClickMenu();
                  }
                }
              ]
            },
            {
              label: 'Conversation', command: (event) => {
              },
              items: [
                {
                  label: 'Calls', command: (event) => {
                    this.Heading = 'Calls';
                    this.onClickMenu();
                  }
                },
                {
                  label: 'Site Visits', command: (event) => {
                    this.Heading = 'SiteVisits';
                    this.onClickMenu();
                  }
                },
                {
                  label: 'FollowUps', command: (event) => {
                    this.Heading = 'FollowUps';
                    this.onClickMenu();
                  }
                }
              ]
            },
            {
              label: 'Download Reports', command: (event) => {
                this.Heading = "Download Reports";
                this.onClickMenu();
              }
            }
          ];
        }
        //-----End-----//
        this.isSpinnerActive = false;
        this.ranges = this.loggedInuserDetails.Level === 'L2' ? this.rangesforL2 : this.rangesforL1;
      }
    }
    else {
      this.router.navigate(['/login']);
    }
  }
  isInvalidDate = (m: moment.Moment) => {
    //-----if invalid date is selected-----//
    return this.invalidDates.some(d => d.isSame(m, 'day'))
    //-----End-----//
  }
  onClickMenu = () => {
    //-----if date is not selected then show error Message-----//
    if (this.Heading !== "OneDayCall") {
      if (this.selectedDateRange != null && this.selectedDateRange.startDate != null && this.selectedDateRange.endDate != null && this.selectedDateRange != undefined) {
        this.show = false;
      } else {
        this.show = true;
      }
    } else {
      this.show = false;
    }
    //-----End-----//
  }
  onChangeDate = (selectedDateRange) => {
    //-----when date range change-----//
    //-----its bind to dateObj and send as output-----//
    this.dateObj = selectedDateRange;
    //-----End-----//
  }
}
