import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CpReportService } from 'src/app/shared/services/channelPartner/cp-report.service';
import { routerTransition } from 'src/app/router.animations';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { ICpReport } from 'src/app/shared/models/channelpartner/reports.model';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    animations: [routerTransition()]
})
export class ReportsComponent implements OnInit {
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public dateObj: string[] = [];
    public selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
    public CpReport: ICpReport = <ICpReport>{};
    public keysCount = [];
    public allDuplicates: string[] = [];
    public reports: string[] = [];
    public showCpReportTable: boolean = false;
    public duplicateSpinner: boolean = false;
    public dataNotFoundMessage: boolean = false;
    public showDataNotFoundMessage: boolean;
    public NoDataFoundMessage: string;
    public p1: number;
    public ranges: any = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment()],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 6 Months': [moment().subtract(6, 'month'), moment()]
    };

    constructor(public router: Router, private cpReportService: CpReportService) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.duplicateRecords();
            } else {
                this.router.navigate(['/login']);
            }
        }
    }
    onChangeDate = (selectedDateRange) => {
        //-------On change date Graph show-------//
        if (selectedDateRange && selectedDateRange.startDate && selectedDateRange.endDate) {
            this.dateObj['StartDate'] = selectedDateRange.startDate.format('YYYY-MM-DD');
            this.dateObj['EndDate'] = selectedDateRange.endDate.format('YYYY-MM-DD');
            this.getReports();
        }
        //-------End-------//
    }

    getReports = () => {
        this.cpReportService.GetCpReports(this.loggedInuserDetails, this.dateObj).subscribe((response) => {
            if (response && response["data"] && response["data"].length > 0) {
                this.reports = response["data"];
                this.dataNotFoundMessage = false;
                this.CpReport = this.PreparedgraphObject(response["data"], 'Cpreport', 'CP_Name');
                this.duplicateRecords();
                this.showCpReportTable = true;

                //-------For "Row Total" in Table-------//
                let keys = Object.keys(response["data"][0]);
                response["data"].forEach(data => {
                    let count = 0;
                    keys.forEach(key => {
                        if (data[key] && key != 'CP_Name')
                            count += data[key];                      //get the Total count of Row
                    });
                    data.count = count;
                });
                keys = Object.keys(response["data"][0]);
                //-------End-------//

                //------- "Column Total" in Table-------//
                keys.forEach(key => {
                    if (key !== 'CP_FirstName') {
                        let arr = response["data"].filter(x => x[key] !== null);     // filter keys from Response 
                        if (arr && arr.length > 0) {
                            let cnt = 0;
                            arr.forEach(element => {
                                if (element[key]) {
                                    cnt += element[key];
                                }
                            });
                            this.keysCount[key] = cnt;
                        }
                    }
                });
                //-------End-------//
            }
            else {
                this.dataNotFoundMessage = true;
            }
        });
    }
    PreparedgraphObject = (response, chartId, name) => {
        //------- splice(Remove) First name and Last name from Keys-------//
        if (response) {
            let axisValue = Object.keys(response[0]);
            let index = axisValue.indexOf(name);
            if (index !== -1) {
                axisValue.splice(index, 1);
            }
            return { id: chartId, response: response, value: axisValue, name: name };
        }
        //-------End-------//
    }
    duplicateRecords = () => {
        //-------For Duplicate chart-------//
        this.duplicateSpinner = true;
        this.cpReportService.getDuplicateRecords(this.loggedInuserDetails).subscribe((response) => {
            if (response && response["data"]) {
                if (response['exception']) {
                    this.showDataNotFoundMessage = true;
                    this.NoDataFoundMessage = response['exception'];
                } else {
                    this.showDataNotFoundMessage = false;
                    this.NoDataFoundMessage = '';
                }
                this.allDuplicates = response["data"];
                this.duplicateSpinner = false;
            }
        })
        //-------End-------//
    }
    trackByFn(item) {
        return item.id; // or item.id
    }
}
