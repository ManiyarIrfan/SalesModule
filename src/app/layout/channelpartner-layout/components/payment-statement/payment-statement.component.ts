import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { MystatementService } from 'src/app/shared/services/channelPartner/mystatement.service';
import { routerTransition } from 'src/app/router.animations';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { Ishowstatement, cpOrderDetail } from 'src/app/shared/models/channelpartner/payment-statement.model';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-payment-statement',
    templateUrl: './payment-statement.component.html',
    styleUrls: ['./payment-statement.component.scss'],
    animations: [routerTransition()]
})
export class PaymentStatementComponent implements OnInit, OnDestroy {
    @ViewChild('uploadInvoiceModal', { static: false }) public uploadInvoiceModal: ModalDirective;
    public showDataNotFoundMessage: boolean = true;
    public showstatement: Ishowstatement[] = [];
    public loggedInuserDetails: IloggedInuserDetails[] = [];
    public isSpinnerActive: boolean = true;
    public hideConfimBtn: string[];
    public DataNotFoundError: String;
    public showDataNotFoundError: boolean = true;
    public cpOrderDetail: cpOrderDetail = <cpOrderDetail>{};
    public importExcel: FileAttachment[] = [];
    public invoiceCpDetails: string[] = [];
    public p1: number;
    public confirmDeleteMsg: boolean = false;
    public importEnquiryExcelVariable = [];
    public ModalHeader: string = '';

    public customerStatementSubscription: Subscription;
    public uploadAurDeleteInvoiceSubscription: Subscription;

    constructor(public router: Router, private paymentService: MystatementService, private snackBar: MatSnackBar) {
    }
    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.customerStatement();
            }
        } else {
            this.router.navigate(['/login']);
        }
    }

    customerStatement = () => {
        //******** Customer Statement all data ********/
        this.customerStatementSubscription = this.paymentService.GetMyStatement(this.loggedInuserDetails).subscribe((response) => {
            if (response['exception'] === "No Data Found") {
                this.DataNotFoundError = response['exception'];
            } else {
                this.showDataNotFoundError = false;
                if (response && response["data"]) {
                    this.showstatement = response["data"];
                }
            }
            this.isSpinnerActive = false;
        });
        //******** End ********/
    }
    createInvoice = (orderDetailsModel) => {
        //******** Open Pop up for upload Invoice ********/
        this.uploadInvoiceModal.show();
        this.ModalHeader = 'Upload Invoice';
        this.cpOrderDetail = orderDetailsModel;
        this.confirmDeleteMsg = false;
        //******** End ********/
    }
    uploadAurDeleteInvoice = (cpOrderDetail, importExcel, updateCpLeadForm) => {
        //******** Upload invoice ********/
        if (importExcel !== undefined) {
            if (importExcel.length > 1) {
                let test = importExcel.length;
                this.importEnquiryExcelVariable.push(importExcel[test - 1]);
            } else {
                this.importEnquiryExcelVariable = importExcel;
            }
        }
        this.uploadAurDeleteInvoiceSubscription = this.paymentService.cpInvoiceUpload(this.loggedInuserDetails, cpOrderDetail, this.importEnquiryExcelVariable).subscribe((response) => {
            if (response && response['value']['successful']) {
                this.showSuccessBar(this.confirmDeleteMsg === true ? 'File Deleted Successfully' : 'File Uploaded Successfully');
                this.customerStatement();
                cpOrderDetail = [];
                this.importExcel = [];
                updateCpLeadForm.form.markAsPristine();
                updateCpLeadForm.form.markAsUntouched();
            } else {
                this.showFailedBar(this.confirmDeleteMsg === true ? 'File Failed to Delete' : 'File Failed to upload');
            }
        });

        //******** End ********/
    }
    onCloseBtn = () => {
        this.uploadInvoiceModal.hide();
    }
    confirmDeleteInvoice = (invoiceDetails) => {
        this.ModalHeader = 'Delete Invoice';
        this.uploadInvoiceModal.show();
        this.invoiceCpDetails = invoiceDetails;
        this.confirmDeleteMsg = true;
    }
    @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
        if (event.keyCode === 27) {
            this.onCloseBtn();
        }
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    ngOnDestroy() {
        this.customerStatementSubscription ? this.customerStatementSubscription.unsubscribe() : null;
        this.uploadAurDeleteInvoiceSubscription ? this.uploadAurDeleteInvoiceSubscription.unsubscribe() : null;
    }
    showSuccessBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
    }
    //------- failed snakbar method -------//
    showFailedBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
    }
}