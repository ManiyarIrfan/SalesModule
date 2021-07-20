import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { EmpServiceService } from 'src/app/shared/services/employee/emp-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tru-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})

export class ServiceRequestComponent implements OnInit {
  public showDataNotFoundMessage: boolean = false;
  public showServiceReqEmplyee: any;
  public loggedInuserDetails: any;
  public isLoading: boolean = false;
  public p1: number;
  public isShow: boolean = true;
  public NoDataFoundMessage: string = "";
  public reportSubscription: Array<Subscription> = []

  constructor(public router: Router, private sharedService: SharedService,
    private empServiceService: EmpServiceService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    const service = this.empServiceService.getServiceDetails(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        if (response['exception'] === "No Data Found") {
          this.showDataNotFoundMessage = true;
          this.NoDataFoundMessage = response['exception'] + " in Service Request.";
        } else {
          this.showServiceReqEmplyee = response['data'];
        }
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.sharedService.changeUserListener.subscribe((user) => {
      if (user) {
        this.getSearchCustomerService(user);
      }
    })
    this.reportSubscription.push(service);
  }

  getSearchCustomerService = (user) => {
    const serviceCust = this.empServiceService.getServiceDetailsforCustomer(user).subscribe((response) => {
      if (response && response["data"]) {
        if (response['exception'] === "No Data Found") {
          this.showDataNotFoundMessage = true;
          this.NoDataFoundMessage = response['exception'] + " in Service Request.";
        } else {
          this.showServiceReqEmplyee = response["data"];
          this.showDataNotFoundMessage = false;
        }
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.reportSubscription.push(serviceCust);

  }
  ngOnDestroy() {
    for (let item of this.reportSubscription) {
      item.unsubscribe();
    }
  }
}