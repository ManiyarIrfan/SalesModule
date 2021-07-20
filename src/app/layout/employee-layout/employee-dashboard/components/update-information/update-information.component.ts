import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';;
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { EmployeeRoleService } from 'src/app/shared/services/employee/employee-role.service';
const tab14 = `tab14`;
const tab15 = `tab15`;
@Component({
    selector: 'app-update-information',
    templateUrl: './update-information.component.html',
    styleUrls: ['./update-information.component.scss'],
    providers: [NgbTabset]
})
export class UpdateInformationComponent implements OnInit, OnChanges {
    @Input() referralInfoData: any;
    @Input() Enqid: any;
    public loggedInuserDetails: any;
    public employeeRoledetails: any;
    public emprole: any;
    public role: any = [];
    public roling: any = [];
    public id: any;
    public details: any;
    public referralInfo: any = [];
    public orderInfo: any = [];
    // callInfo: any;
    constructor(public router: Router,
        private employeeRoleService: EmployeeRoleService,
        private sharedService: SharedService) { }
    @ViewChild('tabset', { static: false }) tabset;
    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.emprole = this.loggedInuserDetails.Role;
                this.getRole();
            }
        } else {
            this.router.navigate(['/login']);
        }
        this.sharedService.changeLead1Listener.subscribe((tabNumber) => {
            this.tabset.select(tabNumber);
        });
        this.sharedService.changeLeadGenerateListener.subscribe((tabno) => {
            this.tabset.select(tabno);
        });
        this.sharedService.changeallLeadSearchDetailsListener.subscribe((selectedLeadDetails) => {
            let tab = selectedLeadDetails.tabNo
            this.referralInfo = [];
            this.tabset.select(tab);
            if (tab === tab14) {
                this.id = selectedLeadDetails
            }
            if (tab === tab15) {
                this.referralInfo = selectedLeadDetails;
            }
        });
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.referralInfoData && this.referralInfoData || changes.Enqid && this.Enqid) {
            if (this.referralInfoData) {
                let selected = [];
                selected['LeadId'] = this.referralInfoData.referralInfo;
                this.referralInfo = selected;
            } else {
                this.id = this.Enqid;
            }
        }
    }

    getRole = () => {
        this.employeeRoleService.getEmployeeRole().subscribe((response) => {
            if (response) {
                this.employeeRoledetails = response;
                this.role = this.employeeRoledetails.Employee;
            }
            let arr = this.role.filter(x => x[this.emprole]);
            this.roling = arr[0][this.emprole].Tabs;
        });
    }
    receiveMessage($event) {
        this.id = $event
    }
    receiveMessageOpportunity($event) {
        this.referralInfo = $event
    }
    leadGenerationDetails($event) {
        this.details = $event;
    }
    receiveCustOrderInfo($event) {
        this.orderInfo = $event;
    }
}