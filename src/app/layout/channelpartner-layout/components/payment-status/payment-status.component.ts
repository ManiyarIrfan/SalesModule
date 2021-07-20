import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentStatusService } from 'src/app/shared/services/channelPartner/payment-status.service';
import { routerTransition } from 'src/app/router.animations';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { Ipaystatus } from 'src/app/shared/models/channelpartner/payment-status..model';

@Component({
    selector: 'app-payment-status',
    templateUrl: './payment-status.component.html',
    styleUrls: ['./payment-status.component.scss'],
    animations: [routerTransition()]
})
export class paymentstatusComponent implements OnInit {
    public showDataNotFoundMessage: boolean = true;
    public paystatus: Ipaystatus[] = [];
    public isSpinnerActive: boolean = true;
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public DataNotFoundError: String;
    public p1: number;
    public showDataNotFoundError: boolean = true;
    constructor(public router: Router, private paymentStatusService: PaymentStatusService) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.paymentStatusService.GetAllPayStatus(this.loggedInuserDetails).subscribe((response) => {
                    if (response['exception'] === "No Data Found") {
                        this.DataNotFoundError = response['exception'];
                    } else {
                        this.showDataNotFoundError = false;
                        if (response && response["data"]) {
                            this.paystatus = response["data"];
                        }
                    }
                    this.isSpinnerActive = false;
                });
            }
        } else {
            this.router.navigate(['/login']);
        }
    }
    trackByFn(item) {
        return item.id; // or item.id
    }
}