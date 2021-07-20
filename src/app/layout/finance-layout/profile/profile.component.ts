import { Component, OnInit } from '@angular/core';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  filesModel: FileAttachment[] = [];
  profileModel: any = [];
  isEdit: boolean = true;
  p1: number;
  emailPattren: any = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  constructor() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));

  }

  ngOnInit() {
  }


  onUpload = (profileForm) => {

  }

  receiveimage = ($event) => {
    this.filesModel = $event;
  }

  trackByFn(item) {
    return item.id;
  }

}
