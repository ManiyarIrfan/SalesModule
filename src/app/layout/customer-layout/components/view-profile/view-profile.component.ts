import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { routerTransition } from 'src/app/router.animations';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IcustModel, IflatDetails, IgetFileURL } from 'src/app/shared/models/Customer/view-profile.model';
import { MatSnackBar } from '@angular/material';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'app-view-profile',
    templateUrl: './view-profile.component.html',
    styleUrls: ['./view-profile.component.scss'],
    animations: [routerTransition()]
})
export class ViewProfileComponent implements OnInit, OnDestroy {
    @ViewChild('showQRModal', { static: false }) public showQRModal: ModalDirective;

    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public custModel: IcustModel = <IcustModel>{};
    public getFileURL: IgetFileURL = <IgetFileURL>{};
    public flatDetails: IflatDetails = <IflatDetails>{};
    public isEdit: boolean = false;
    public isSpinnerActive: boolean = true;
    public emailPattren: any = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    public QRCode: string;

    public customerSubscription: Subscription;
    public UpdateSubscribe: Subscription;
    public fetchPaymentLinkSubscription: Subscription;
    public addVirtualPaymentSubscription: Subscription;
    public OccupationInfo: any = [
        { key: "Service", value: "Service" },
        { key: "Business", value: "Business" },
        { key: "Retirement", value: "Retirement" },
        { key: "Consultant", value: "Consultant" },
        { key: "House-wife", value: "House-wife" }];
    constructor(public router: Router, private customerService: CustomerService, private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
        this.getCustomerDetails();
    }
    //****** get Customer Details  ******/
    getCustomerDetails = () => {
        this.customerSubscription = this.customerService.GetCustomerDetails(this.loggedInuserDetails)
            .subscribe((response) => {
                if (response && response["data"]) {
                    this.custModel = response["data"][0][0];
                    this.QRCode = this.custModel['QRCodeImage'];
                    this.custModel.custType = "customer";
                    this.flatDetails = response["data"][1];
                    this.getFileURL = (response["data"][1] && response["data"][1][0]) ? response["data"][1][0] : [];
                    this.getFileURL['Draft'] = 'https://trushare.blob.core.windows.net/production/KEKARAV_%20Agreement_Draft_Copy.pdf';

                    this.custModel.invoice_number ? this.fetchPaymentLink(this.custModel.invoice_number) : null;
                }
                this.isSpinnerActive = false;
            });
        this.getFileURL['Draft'] = 'https://trushare.blob.core.windows.net/production/Kekarav_CPs_faqs.pdf';
    }
    //****** Fetch Paytment link on invoice number ******/
    fetchPaymentLink = (invoiceNumber) => {
        this.fetchPaymentLinkSubscription = this.customerService.fetchPaymentLink(this.loggedInuserDetails, invoiceNumber).subscribe(response => {
            if (response && response['status']) {
                response['status'] && response['status'].toLowerCase() === 'paid' ? this.addVirtualWallet(response) : null;
            }
        })
    }

    //****** Add to Virtual Wallet ******/
    addVirtualWallet = (transactiondetails) => {
        transactiondetails.TransactionId = this.custModel.PaymentLinkId;
        transactiondetails.TransactionType = "PaymentLink";
        this.addVirtualPaymentSubscription = this.customerService.addVirtualPayment(this.loggedInuserDetails, transactiondetails, 'INSERT').subscribe(response => {
            if (response) { }
        })
    }

    // when Customer/Lead Create account cp Details Reload throw output
    reloadMessage($event) {
        this.getCustomerDetails();
    }
    OnEditBtnClick = () => {
        this.isEdit = true;
    }
    openfile = (file) => {
        window.open(file);
    }
    OnUpdateBtnClick = () => {
        this.isSpinnerActive = true;
        this.UpdateSubscribe = this.customerService.UpdateCustomerDetails(this.custModel, this.loggedInuserDetails).subscribe((response) => {
            response && response['successful'] ?
                this.showSuccessBar("Record updated sucessfully.") : this.showFailedBar("Record updation failed.");
            this.isSpinnerActive = false;
        });
        this.isEdit = false;
    }
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }
    ngOnDestroy() {
        this.customerSubscription ? this.customerSubscription.unsubscribe() : null;
        this.UpdateSubscribe ? this.UpdateSubscribe.unsubscribe() : null;
        this.addVirtualPaymentSubscription ? this.addVirtualPaymentSubscription.unsubscribe() : null;
        this.fetchPaymentLinkSubscription ? this.fetchPaymentLinkSubscription.unsubscribe() : null;
    }
    trackByFn(item) {
        return item.id; // or item.id
    }
    showSuccessBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
    }
    //------- failed snakbar method -------//
    showFailedBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
    }

}
