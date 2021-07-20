import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { MessageService } from 'primeng/api';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { routerTransition } from 'src/app/router.animations';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { environment } from 'src/environments/environment';
import { DpmadminService } from 'src/app/shared/services/employee/dpmadmin.service';
@Component({
    selector: 'app-employee-dashboard',
    templateUrl: './employee-dashboard.component.html',
    styleUrls: ['./employee-dashboard.component.scss'],
    animations: [routerTransition()],
    providers: [MessageService]
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
    @ViewChild('showPerformanceInHrmsModal', { static: false }) public showPerformanceInHrmsModal: ModalDirective;
    @ViewChild('showIncentiveModal', { static: false }) public showIncentiveModal: ModalDirective;
    public showToast: boolean = false;
    public empID: any;
    public callerID: any;
    public loggedInuserDetails: any;
    public callerName: any;
    public callerMobileNo: any;
    public status: any;
    public missedCall: boolean = false;
    public customerMissed: boolean = false;
    public AgentName: string;
    public followUpcustomer: number;
    public followuptime: any;
    public incomingCallInfo: any;
    public id: any;
    public referralInfo: any;
    public hrUrl: string = '';
    public getEmployeeFirstLoginTimeSubscription: Subscription;
    public offlineCallcustomer: string;
    public callStatus: string;
    public IncentiveData: any = [];
    constructor(private messageService: MessageService,
        private sharedService: SharedService, private DpmadminService: DpmadminService) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 3 || this.loggedInuserDetails.Role === 11) ? this.getEmployeeFirstLoginTime() : null;
                this.AgentName = this.loggedInuserDetails.Firstname + this.loggedInuserDetails.LastName;
                this.incomingCallNotification();
                this.incomingDetails();
                // this.outgoingCallDetails();
                this.followupDetailsPopUp();
                this.offlineCallPopUp();
                this.getIncentiveNameList();
            }
        }
    }
    title = 'signalR';

    incomingCallNotification = () => {
        //************ Incoming call is incoming Notification Response check socket *************//
        // Dont Add "Api/" in url
        let connection = new signalR.HubConnectionBuilder().withUrl(`${environment.empApiUrl}MyHub/GetCallNotification/CallSid,From,To,Direction,CallType,DialWhomNumber`).build();
        connection.on("Send", data => {
            this.incomingCallInfo = data;
            this.empID = data.employeeId
            this.callerID = data.callerEntityId;
            this.callerName = data.customerName;
            this.callerMobileNo = data.from;
            if (this.empID === this.loggedInuserDetails.EntityId && data.status === 'busy') {         //Toast should show to Exact employee who got call 
                this.messageService.add({ key: 'custom', severity: 'custom', life: 100000 });
            }
        });
        connection.start();
        //************ End *************//
    }

    incomingDetails = () => {
        //************ Incoming call Details Response check socket *************//
        // Dont Add "Api/" in url
        let incomingCallConnection = new signalR.HubConnectionBuilder().withUrl(`${environment.empApiUrl}Employees/GetIncomingCallDetails/CallSid,From,DialWhomNumber,Direction,StartTime,EndTime,Duration,RecordingUrl,CallType`).build();
        incomingCallConnection.on("Incoming", incomingcallData => {
            if (incomingcallData.to === '0' + this.loggedInuserDetails.MobileNo) {
                this.missedCall = incomingcallData.status !== 'completed' ? true : false;
                this.customerMissed = incomingcallData.status === 'client-hangup' ? true : false;
                this.status = incomingcallData.status;
                this.messageService.add({ key: 'incomingOutgoing', severity: 'info', life: 10000 });
            }
        });
        incomingCallConnection.start();
        //************ End *************//
    }
    followupDetailsPopUp = () => {
        //********** Follow up Pop up show before 5 minutes of schduled ***********//
        // Dont Add "Api/" in url
        let followupConnection = new signalR.HubConnectionBuilder().withUrl(`${environment.empApiUrl}Employees/GetFollowUpNotification/CustomerId,CustomerName,FollowUpDate,FollowUpTime,EmployeeAssinged,FollowUpDetails`).build();
        followupConnection.on("FollowUpNotification", followupData => {
            if (followupData.employeeAssinged === this.loggedInuserDetails.EntityId) {
                this.followUpcustomer = followupData.customerId;
                this.followuptime = followupData.followUpTime;
                this.messageService.add({ key: 'followupKeyData', severity: 'custom', life: 100000 });
            }
        });
        followupConnection.start();
        //********** End ***********//
    }

    offlineCallPopUp = () => {
        //********** Offline Call display after ending Call ***********//
        // Dont Add "Api/" in url
        let offlineCallConnection = new signalR.HubConnectionBuilder().withUrl(`${environment.empApiUrl}Employees/OfflineCall/UserId,UserType,EntityId`).build();
        offlineCallConnection.on("offlineCall", offlineCallData => {
            if (offlineCallData.employeeId === this.loggedInuserDetails.EntityId) {
                this.offlineCallcustomer = offlineCallData.customerName;
                this.callStatus = offlineCallData.callStatus;
                this.messageService.add({ key: 'offlinecallData', severity: 'custom', life: 100000 });
            }
        });
        offlineCallConnection.start();
        //********** End ***********//
    }

    moreInfo = (incomingCallInfo) => {
        //************* Moved to Lead details Tab **************//
        if (incomingCallInfo.callerUserType === 'Referral') {
            this.referralInfo = { referralInfo: incomingCallInfo.callerEntityId };
            this.sharedService.shareLeadDetails('tab15');
        } else {
            this.id = { id: incomingCallInfo.callerEntityId };
            this.sharedService.shareLeadDetails('tab14');
        }
        //************* End **************//
    }
    // outgoingCallDetails = () => {
    //     //************ Outgoing call Details Response check socket *************//
    //     let outgoingCallConnection = new signalR.HubConnectionBuilder().withUrl(this.appConfig.empApiUrl + "Employees/CallCustomer/UserId,UserType,EntityId").build();
    //     outgoingCallConnection.on("Outgoing", outgoiongcallData => {
    //         if (outgoiongcallData.from === '+91' + this.loggedInuserDetails.MobileNo) {
    //             this.missedCall = outgoiongcallData.agent_status !== 'Connected' ? true : false;
    //             this.customerMissed = outgoiongcallData.agent_status === 'Connected' && outgoiongcallData.status !== 'Connected' ? true : false;
    //             this.status = outgoiongcallData.status;
    //             this.messageService.add({ key: 'incomingOutgoing', severity: 'info', life: 10000 });
    //         }
    //     });
    //     outgoingCallConnection.start();
    //     //************ End *************//
    // }

    onReject() {
        this.messageService.clear('c');
    }

    getEmployeeFirstLoginTime = () => {
        //************show popup for first login of employee *************//
        this.getEmployeeFirstLoginTimeSubscription = this.sharedService.getEmployeeFirstLoginTime(this.loggedInuserDetails).subscribe((response) => {
            if (response && response['data'] && response['data'][0] && response['data'][0].LoggedInTime) {
                //database login time with add 5 min
                let dbTime = (new Date(response['data'][0].LoggedInTime).getTime() + (5 * 60000));
                let sysTime = new Date().getTime();
                if (dbTime > sysTime) {
                    this.hrUrl = `${environment.hrLoginUrl}`
                    this.showPerformanceInHrmsModal.show();
                }
            }
        });
        //************ End *************//
    }
    close = () => {
        this.showPerformanceInHrmsModal.hide();
        (this.loggedInuserDetails.Role === 5 && this.loggedInuserDetails.TenantId === 0 && this.loggedInuserDetails.EngagementType === 'OnDemand') ? this.showIncentiveModal.show() : null;
    }
    getIncentiveNameList = () => {
        this.DpmadminService.getIncentiveNames(this.loggedInuserDetails, null, null).subscribe((response) => {
            this.IncentiveData = response && response["data"] && response["data"][0].length > 0 ? response["data"][0] : [];
        });
    }

    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    //*****destroy subscribe methode*****//
    ngOnDestroy() {
        this.getEmployeeFirstLoginTimeSubscription ? this.getEmployeeFirstLoginTimeSubscription.unsubscribe() : null;
    }
}