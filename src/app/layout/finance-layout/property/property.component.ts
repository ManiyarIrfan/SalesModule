import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { NewProjectsService } from 'src/app/shared/services/customer/new-projects.service';

const assetPath = '../../../../assets/images/';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit, OnDestroy {
  loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  AllSites: object[] = [];
  SitefilesData: object[] = [];

  apiSubscription: Array<Subscription> = [];
  SelectedImg: any;

  @ViewChild('viewImageModel', { static: false }) public viewImageModel: ModalDirective;

  constructor(
    private router: Router,
    private siteService: NewProjectsService) {

    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails === null) {
      this.router.navigate(['/login'], { queryParams: { flag: true, Module: 'finance', Action: 'Property' } });
    } else {
      this.getAllSite();
    }
  }

  ngOnInit() {

  }

  getAllSite = () => {
    const siteSubscribtion = this.siteService.getSiteDetails(this.loggedInuserDetails, "", 'SearchAllSite')
      .subscribe((response) => {
        if (response && response['data']) {
          this.AllSites = response['data'][0];
          let files = [];
          files = response['data'][1].filter(x => x.SubProjectId === null);
          this.SitefilesData = files.reduce((data, x) => {
            (data[x['SiteId']] = data[x['SiteId']] || []).push(x);
            return data;
          }, {});
        }
      });
    this.apiSubscription.push(siteSubscribtion);
  }

  // View File On Pop Up  
  viewImages = (image) => {
    this.SelectedImg = image.File;
    // this.SelectedSectorTitle = image.Description;
    if (image.img !== '') {
      this.viewImageModel.show();
    }
  }

  getFormatedData = (item, extension) => {
    let fileExt = '';
    switch (extension.toLowerCase()) {
      case 'png':
        fileExt = 'png.png';
        break;
      case 'jpeg':
      case 'jpg':
        fileExt = 'jpg.png';
        break;
      case 'pdf':
        fileExt = 'pdf.png';
        break;
      case 'doc':
      case 'docx':
      case 'dot':
      case 'docm':
        fileExt = 'doc.png';
        break;
      case 'xls':
      case 'xlsx':
      case 'xltm':
      case 'xlt':
      case 'xltx':
        fileExt = 'xls.png';
        break;
    }
    item.docStyle = assetPath + fileExt;
    return item
  }

  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    for (let item of this.apiSubscription) {
      item.unsubscribe();
    }
    this.apiSubscription = [];
  }
}
