import { Component, OnInit, SimpleChanges, Input, OnDestroy } from '@angular/core';
// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NewProjectsService } from 'src/app/shared/services/customer/new-projects.service';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IamenityDetails, IareaDetails, IspecificationModel } from 'src/app/shared/models/Customer/new-project.model';

@Component({
  selector: 'app-cust-aggregation',
  templateUrl: './cust-aggregation.component.html',
  styleUrls: ['./cust-aggregation.component.scss']
})
export class CustAggregationComponent implements OnInit, OnDestroy {
  @Input() siteDetail;
  public loggedInuserDetails: IloggedInuserDetails[] = [];
  public bhkDetails: string[] = [];
  public amenityDetails: IamenityDetails[] = [];
  public areaDetails: IareaDetails = <IareaDetails>{};
  // public amenitiesDetails: any;
  public specificationModel: IspecificationModel = <IspecificationModel>{};
  public selectedamenityList: string[] = [];
  public budgetDetails: string[] = [];
  public isSpinnerActive: boolean = true;
  public parkingDetails: any = [
    { key: 1, value: "1 Parking" },
    { key: 2, value: "2 Parking" },
    { key: 3, value: "3 Parking" }];

  public getSpecificationSubscription: Subscription;
  public selectedprefreceSubscription: Subscription;
  public customerSpecificationSubscription: Subscription;

  constructor(private newProjectsService: NewProjectsService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser')); //********** get User Details from Local Storage
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.siteDetail && this.siteDetail) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser')); //********** get User Details from Local Storage
      this.getSpecification(this.siteDetail, 'SearchBySite');
      this.getSpecification(this.siteDetail, 'Get_Data');
      this.isSpinnerActive = false;
    }
  }
  // ********** get Default Specification of Site ********** //
  getSpecification = (siteInfo, input) => {
    this.getSpecificationSubscription = this.newProjectsService.getSpecificationOption(this.loggedInuserDetails, siteInfo, input).subscribe((response) => {
      if (response && response['data']) {
        switch (input) {
          case 'SearchBySite':
            this.amenityDetails = response['data'][2]
            this.bhkDetails = response['data'][3];
            this.areaDetails = response['data'][4];
            this.customerSelectedPrefrence();
            break;
          case 'Get_Data':
            this.budgetDetails = response['data'][3];
            break;
        }
      }
    });
  }
  // **********  Customer already Selected Prefrences ********** //
  customerSelectedPrefrence = () => {
    let input = 'GetById';
    this.selectedprefreceSubscription = this.newProjectsService.getSelectedPrefrences(this.loggedInuserDetails, input, this.siteDetail.SiteId, '').subscribe((response) => {
      if (response && response['data'] && response['data'][0]) {
        this.specificationModel = response['data'][0];
        this.selectedAmenities(response['data'][0][0]);
      }
    });
  }
  selectedAmenities = (selected) => {
    if (selected) {
      this.specificationModel['BHK'] = Number(selected.BHK);
      this.specificationModel['Area'] = Number(selected.Area);
      this.specificationModel['Budget'] = Number(selected.Budget);
      this.specificationModel['CarParking'] = Number(selected.CarParking);
      this.specificationModel['Description'] = selected.Description;
      let amenityList = selected && selected['Amenities'].split(',');
      this.amenityDetails.forEach(element => {
        let amenities = amenityList.some(x => Number(x) === Number(element['AmenityId']));
        if (amenities) {
          element['checked'] = true;
          this.onChange(element, true, this.selectedamenityList);
        }
      });
    }
  }
  // ********** checked push in List ********** //
  onChange = (amenity, checked: boolean, list) => {
    if (checked) {
      list.push(amenity.AmenityId);
    } else {
      let index = list.indexOf(amenity.AmenityId);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
  }
  // ********** Submit Customer Specification ********** //
  submitSpecification = (specificationModel) => {
    specificationModel.AmenityId = this.selectedamenityList.join(',');
    specificationModel.SiteId = this.siteDetail.SiteId;
    let input = 'Insert';
    this.customerSpecificationSubscription = this.newProjectsService.customerSpecification(this.loggedInuserDetails, specificationModel, input).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar('All Preferences SuccessFully Submitted');
      } else {
        this.showFailedBar('Not Submitted Successfully');
      }
    });
  }
  //********** show snackbar for message **********//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['red-snackbar'] });
  }
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy(): void {
    this.getSpecificationSubscription ? this.getSpecificationSubscription.unsubscribe() : null;
    this.selectedprefreceSubscription ? this.selectedprefreceSubscription.unsubscribe() : null;
    this.customerSpecificationSubscription ? this.customerSpecificationSubscription.unsubscribe() : null
  }
}
