import { Component, OnInit, OnDestroy, ViewChild,HostListener } from '@angular/core';
import { NewProjectsService } from 'src/app/shared/services/customer/new-projects.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ModalDirective } from 'ngx-bootstrap';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IsiteDetailsList, IsiteDetails, Iconstraintlist } from 'src/app/shared/models/Customer/new-project.model';

@Component({
  selector: 'app-new-projects',
  templateUrl: './new-projects.component.html',
  styleUrls: ['./new-projects.component.scss']
})
export class NewProjectsComponent implements OnInit, OnDestroy {
  @ViewChild('ConstraintListModal', { static: false }) public ConstraintListModal: ModalDirective;
  @ViewChild('MapviewLargeModel', { static: false }) public MapviewLargeModel: ModalDirective;

  public loggedInuserDetails: IloggedInuserDetails[] = [];
  public siteDetailsList: IsiteDetailsList[] = [];
  public isSpinnerActive: boolean = true;
  // public subprojectList: any[] = [];
  public siteDetails: IsiteDetails = <IsiteDetails>{};
  public showsubProjectList: boolean = false;
  public customerDnD: boolean = false;
  public disablebreadcrump: boolean = false;
  public siteName: string = "";
  public showOrderDetails: string[] = [];
  public architectOfOrder: boolean = false;
  public fileList: string[] = [];
  public subProjectDetails: string[] = [];
  public noDataFound: boolean = false;
  public siteId: number;
  public AllSites: string[] = [];
  public constraintlist: Iconstraintlist = <Iconstraintlist>{};
  public fileModel: any = [];
  public dynamicURL = '';

  public myPropertiesSubscription: Subscription;
  public siteDetailsSubscribtion: Subscription;
  public keyHighlightsList: string[] = [];
  public fileDetails: string[] = [];
  public Title: string;
  public SelectedImg: any;
  public SelectedSectorTitle: any;

  constructor(private newProjectsService: NewProjectsService,
    private snackBar: MatSnackBar, public router: Router) {
    this.dynamicURL = this.router.url.split('/')[2];
  }

  ngOnInit() {
    // this.breadCrumps = [{ label: 'Current Projects', url: '/customer/new-Projects' }];
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getAllSite('CustomerSites');
        this.getAllSite('SearchAllSite');
      }
    }
  }
  //******* Get All Site *******//
  getAllSite = (input) => {
    this.siteDetailsSubscribtion = this.newProjectsService.getSiteDetails(this.loggedInuserDetails, "", input).subscribe((response) => {
      if (response && response['data'][0]) {
        switch (input) {
          case 'SearchAllSite':
            this.AllSites = response['data'][0].length > 0 ? response['data'][0] : this.showSnackBar('No Site Found');
            let files = [];
            files = response['data'][1].filter(x => x.SubProjectId === null);
            this.fileDetails = files.reduce((r, a) => {
              r[a.SiteId] = [...r[a.SiteId] || [], a];
              return r;
            }, {});
            this.myProperties();
            break;
          case 'CustomerSites':
            response['data'][0].map((ele) => {
              ele.Files = ele.Files && ele.Files.split("*#*");
              ele.FileNames = ele.FileNames && ele.FileNames.split("*#*");
              let DocDetails = [];
              ele.Files && ele.Files.map((element, index) => {
                DocDetails.push({ 'FileName': element, 'File': element, 'Description': ele.FileNames[index] });
              })
              ele.fileModel = DocDetails;
            });
            this.siteDetailsList = response['data'][0].length > 0 ? response['data'][0] : this.showSnackBar('No Site Found');
            break;
        }
        this.isSpinnerActive = false;
      } else {
        this.isSpinnerActive = false;
      }
    });
  }

  //********** purchased plot or flat list **********//
  myProperties = () => {
    this.myPropertiesSubscription = this.newProjectsService.getOrder(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"].length > 0) {
        this.showOrderDetails = response["data"];
        this.mySitefileDetails(this.showOrderDetails);
        // ****** remove Site if already in My property ******//
        let index = this.siteDetailsList.findIndex(x => x.SiteName === this.showOrderDetails[0]['ProjectName']);
        (index !== -1) ? this.siteDetailsList.splice(index, 1) : null;
        //****** End ******//
        this.noDataFound = false;
      } else {
        this.noDataFound = true;
      }
    });
  }
  // ******* Files float to architect for work submission *******//
  mySitefileDetails = (siteDetail) => {
    let siteDetails = [];
    siteDetails['SubProject'] = siteDetail[0]['FlatNo'] && siteDetail[0]['FlatNo'];
    let SiteId = this.AllSites.filter(x => x['SiteName'] === siteDetail[0]['ProjectName']);
    this.siteId = siteDetails['SiteId'] = SiteId[0] ? (SiteId[0]['SiteId'] ? SiteId[0]['SiteId'] : '') : '';
    this.newProjectsService.filelistOnSite(this.loggedInuserDetails, siteDetails, 'SEARCH').subscribe((response) => {
      if (response && response['data']) {
        let files = response['data'][1];
        let siteFile = files.concat(response['data'][2] && response['data'][2]);
        this.siteId = response['data'][3][0] ? response['data'][3][0]['SiteId'] : this.siteId;
        this.constraintlist = response['data'][6][0] ? response['data'][6][0] : [];
        this.fileList = siteFile.concat(response['data'][7] && response['data'][7]);
        if (response['data'][3][0]) {// ******** image Slider Code creating response  ********* //
          response['data'][3][0]['FileNames'] = response['data'][3][0].SiteNames && response['data'][3][0].SiteNames.split("*#*").map(ele => {
            return ele;
          });
          response['data'][3][0]['Files'] = response['data'][3][0].SiteFiles && response['data'][3][0].SiteFiles.split("*#*").map(ele => {
            return ele;
          });
          response['data'][3][0]['FileNames'] && response['data'][3][0]['FileNames'].forEach((ele, index) => {
            this.fileModel.push({ 'FileName': response['data'][3][0]['FileNames'][index], 'File': response['data'][3][0]['Files'][index], 'Description': response['data'][3][0]['FileNames'][index] });
          });
        }
        // ******** End ********* //
      }
    });
  }
  // **** Show Constraints and Key highlights in POP up **** //
  showModel = (type, siteDetail) => {
    switch (type) {
      case 'Constraint':
        this.Title = 'Constraint Details';
        break;
      case 'keyHighlights':
        this.Title = 'Key Highlights Details';
        this.keyHighlightList(siteDetail);
        break;
    }
    this.ConstraintListModal.show();
  }
  // ********** get Key Highlights **********//
  keyHighlightList = (siteDetail) => {
    this.newProjectsService.getkeyHighlightList(this.loggedInuserDetails, 'keyhighlights').subscribe((response) => {
      if (response && response['data'].length > 0) {
        this.keyHighlightsList = response['data'].filter(x => x.SiteId === siteDetail.SiteId);
      }
    });
  }
  // ****** Ordered Plot/Flat show details ****** //
  myOrderDetails = (siteDetails) => {
    siteDetails['SiteId'] = this.siteId;
    this.architectOfOrder = true;
    this.siteName = siteDetails.ProjectName;
    siteDetails.Type = "Customer Driven";
    this.subProjectDetails = siteDetails;
    this.disablebreadcrump = true;
  }

  getAllPlotlist = (siteDetail) => {
    // this.breadCrumps = [{ label: siteDetail.SiteName, url: '/customer/newproject' }];
    switch (siteDetail.DNDStage) {
      case 'Design Competition':
      case 'Design Competition_multi':
      case 'Customer Driven':
        this.siteDetails = siteDetail.SiteId;
        this.showsubProjectList = true;
        this.customerDnD = false;
        break;
      case 'CustomerAggregation':
        this.siteDetails = siteDetail;
        this.customerDnD = true;
        break;
    }
    this.disablebreadcrump = true;
    this.siteName = siteDetail.SiteName;
  }
  // ***** View File On Pop Up ****** //
  viewImages = (image) => {
    this.SelectedImg = image.File;
    this.SelectedSectorTitle = image.Description;
    if (image.img !== '') {
      this.MapviewLargeModel.show();
    }
  }
 // Esc button close image
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.MapviewLargeModel.hide();
    }
  }
  //********** open selected file in new tab **********//
  openFileInNewTab = (fileUrl: string) => {
    window.open(fileUrl);
  }
  //********** subproject name click**********//
  receivesubprojectDetails = ($event) => {
    // this.breadCrumps.push({ label: $event.SubProjectName, url: '/customer/subproject' })
  }
  //********** Used for NgFor to unique Id Everytym **********//
  trackByFn = (item) => {
    return item.id; // unique id corresponding to the item
  }
  //********** show snackbar for message **********//
  showSnackBar = (message: string) => {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
  
  ngOnDestroy() {
    this.siteDetailsSubscribtion && this.siteDetailsSubscribtion.unsubscribe();
    this.myPropertiesSubscription && this.myPropertiesSubscription.unsubscribe();
  }
}
