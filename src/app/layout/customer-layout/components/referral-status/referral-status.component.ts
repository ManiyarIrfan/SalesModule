import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReferralStatusService } from 'src/app/shared/services/customer/referral-status.service';
import { routerTransition } from 'src/app/router.animations';
import { IshowReferral } from 'src/app/shared/models/Customer/referal-status.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-referral-status',
    templateUrl: './referral-status.component.html',
    styleUrls: ['./referral-status.component.scss'],
    animations: [routerTransition()]
})
export class ReferralStatusComponent implements OnInit {
    public showReferral: IshowReferral[] = [];
    // public showSuccessfullMessage: string = "";
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public isSpinnerActive: boolean = true;
    public p1: number;

    public GetReferralStatusDetailsSubscription:Subscription;


    constructor(public router: Router, private referralStatusService: ReferralStatusService, private snackBar: MatSnackBar) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.GetReferralStatusDetailsSubscription=this.referralStatusService.GetReferralStatusDetails(this.loggedInuserDetails).subscribe((response) => {
                    if (response && response["data"] && response["data"][0].length > 0) {
                        this.showReferral = response["data"][0];
                        this.isSpinnerActive = false;
                    } else {
                        this.isSpinnerActive = false;
                        this.showFailedBar("No Data Found");
                    }
                });
            }
        } else {
            this.router.navigate(['/login']);
        }
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    //------- failed snakbar method -------//
    showFailedBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
    }
    ngOnDestroy()
    { 
       this.GetReferralStatusDetailsSubscription ? this.GetReferralStatusDetailsSubscription.unsubscribe():null;
    }
}
