import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { EmpInteractionService } from 'src/app/shared/services/employee/emp-interaction.service';
@Component({
  selector: 'tru-emp-interaction',
  templateUrl: './emp-interaction.component.html',
  styleUrls: ['./emp-interaction.component.scss']
})
export class EmpInteractionComponent implements OnInit {
  public isOn: boolean;
  public showInteraction: any;
  public loggedInuserDetails: any;
  public isSpinnerActive: boolean = true;
  public isLoading: boolean = false;
  public showDataNotFoundMessage: boolean = false;
  public NoDataFoundMessage: string = "";
  public p1:number;
  public InteractionTypeInfo: any = [
    { key: "PhoneCall", value: "PhoneCall" },
    { key: "Email", value: "Email" },
    { key: "SMS", value: "SMS" },
    { key: "Walking", value: "Walking" },
    { key: "Others", value: "Others" }
  ];
  public Followup: any = [
    { key: "Yes", value: "Yes" },
    { key: "No", value: "No" }
  ];
  constructor(
    public router: Router, 
    private sharedService: SharedService, 
    private empIteractionService: EmpInteractionService) { }
  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.isLoading = true;
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.empIteractionService.getInteractionDetails(this.loggedInuserDetails).subscribe((response) => {
          if (response && response) {
            if (response['exception'] === "No Data Found") {
              this.showDataNotFoundMessage = true;
              this.NoDataFoundMessage = response['exception'] + " in Interaction.";
              this.isLoading = false;
            } else {
              this.showInteraction = response['data'];
              this.getSearchCustomer();
            }
            this.isLoading = false;
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
  getSearchCustomer = () => {
    this.sharedService.changeUserListener.subscribe((user) => {
      this.empIteractionService.getCustomerInteractionDetails(user).subscribe((response) => {
        if (response && response['data']) {
          if (response['exception'] === "No Data Found") {
            this.showDataNotFoundMessage = true;
            this.NoDataFoundMessage = response['exception'] + " in Interaction.";
          } else {
            this.showDataNotFoundMessage = false;
          }
          this.showInteraction = response['data'];
          this.isLoading = false;
        }
      });
      this.isLoading = true;
    });
  }
}