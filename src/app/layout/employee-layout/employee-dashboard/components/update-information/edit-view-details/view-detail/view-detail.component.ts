import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { CustomerDetailService } from 'src/app/shared/services/employee/customer-detail.service';
import {IshowData} from 'src/app/shared/models/employeeModel/edit-view-details.model';
@Component({
  selector: 'tru-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit {
  @ViewChild('showImageModel',{static:false})
  public showImageModel: ModalDirective;
  public isShowDetails: boolean = false;
  public isLoading: boolean = true;
  public showData:IshowData=<IshowData>{};
  public user: string;
  public images: string[] = [];
  public imageNotAvailable: string;
  public isShow: boolean;
  public imagesArray: string[] = [];
  public seperateImage: string[];
  public aadhar: string;
  public pan: string;

  constructor(public router: Router, private sharedService: SharedService, private customerDetailService: CustomerDetailService) { }

  ngOnInit() {
    //-----information about ChannelPatner,Employee,Customer,Refferal according search -----//
    this.sharedService.changeUserListener.subscribe((user) => {
      this.customerDetailService.getCustomerViewDetails(user).subscribe((response) => {
        if (response['exception'] === "No Data Found") {
          this.isShowDetails = false;
          this.isLoading = false;
        }
        if (response && response['data'] && response['exception'] === null) {
          this.showData = response['data'][0];[]
          if (this.showData['ImageUrl ']!= null) {
            this.imagesArray = this.showData['ImageUrl'].split('*#*');
            this.imagesArray.forEach((item) => {
              this.seperateImage = item.split('=');
              if (this.seperateImage[0] === "Aadhar") {
                this.aadhar = this.seperateImage[1];
              }
              if (this.seperateImage[0] === "Pan") {
                this.pan = this.seperateImage[1];
              }
            })
          } else {
            this.aadhar = '';
            this.pan = '';
          }
          this.isShowDetails = true;
          this.isLoading = false;
        }
      });
    });
    //-----END-----//
  }
  showImage = (imageUrl) => {
    //-----Show Image in Popup-----//
    this.showImageModel.show();
    if (imageUrl != "" ) {
      this.images = imageUrl;
      this.isShow = true;
    } else {
      this.isShow = false;
      this.imageNotAvailable = "Image is Not Available.";
    }
    //-----END-----//
  }
  onCloseImage = () => {
    //-----Close Popup-----//
    this.showImageModel.hide();
    //-----END-----//
  }
}