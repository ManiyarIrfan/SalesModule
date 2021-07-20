import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { NewProjectsService } from 'src/app/shared/services/customer/new-projects.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ModalDirective } from 'ngx-bootstrap';
import { IRating } from 'src/app/shared/models/Customer/custAggregation.model';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IdesignBriefModel } from 'src/app/shared/models/Customer/new-project.model';

@Component({
  selector: 'app-architect-details',
  templateUrl: './architect-details.component.html',
  styleUrls: ['./architect-details.component.scss']
})
export class ArchitectDetailsComponent implements OnInit {
  @Input() subProjectDetails;
  @ViewChild('RatingModal', { static: false }) public RatingModal: ModalDirective;
  @ViewChild('DesignBriefModal', { static: false }) public DesignBriefModal: ModalDirective;
  @ViewChild('OptinFormModal', { static: false }) public OptinFormModal: ModalDirective;

  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public architectList: string[] = [];
  public showDataNotFoundMessage: boolean = false;
  public architectListModel: string[] = [];
  public subprojectDetails: string[] = [];
  public fileDetails: any;
  public selectedArchitectList: string[] = [];
  public ratingDetails: IRating = <IRating>{};
  public reviewconsultantList: string[] = [];
  public architectDetails: string[] = [];
  public showSiteRating: boolean = false;
  public ratingnoDataFound: boolean = false;
  public isSpinnerActive: boolean = true;
  public alreadyRated: boolean = false;
  public selectedArchitect: string[] = [];
  public designBrief: string[] = [];
  public keys: string[] = [];
  public designBriefModel: IdesignBriefModel = <IdesignBriefModel>{};
  public selectedList: string[] = [];
  public getarchitectData: any[] = [];
  public tnc: boolean = false;
  public Portfolio: boolean = false;
  public TitleModal: string = '';
  public ModalTitle: string = '';
  public allPrefrences: string[] = [];
  public disableForSelected: boolean = false;

  public architectListSubscription: Subscription;
  public finalarchitectSubscription: Subscription;
  public SelectedArchitectSubscription: Subscription;
  public architectReviewSubscription: Subscription;
  public ratingMasterInsertSubscription: Subscription;
  public customerSpecificationSubscription: Subscription;
  public getDesignBriefDataSubscription: Subscription;
  public getSelectedPrefrencesSubscription: Subscription;
  public architectProfileDetailsSubscription: Subscription;
  public showOptInBtn: boolean;

  constructor(private newProjectsService: NewProjectsService,
    private snackBar: MatSnackBar, private sharedService: SharedService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.subProjectDetails && this.subProjectDetails) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.subProjectDetails.Type === "Customer Driven") {         // if property is already sold out
        this.showOptInBtn = true;
        this.getAllSubProject();
      } else {                                                 // prednd Process
        // date Check for Rating and Selection
        this.showOptInBtn = false;
        if (new Date(this.subProjectDetails.ReviewDueDate).toISOString().split('T')[0] > new Date().toISOString().split('T')[0]) {
          this.getArchitectForRating(this.subProjectDetails);
          this.showSiteRating = true;
        } else {
          this.showSiteRating = false;
          this.getFloatedArchitectList(this.subProjectDetails, 'Customer_Select');
        }
      }
    }
  }
  getAllSubProject = () => {
    this.newProjectsService.getSiteDetails(this.loggedInuserDetails, this.subProjectDetails.SiteId, 'SelectById').subscribe((response) => {
      if (response && response['data'] && response['data'][0].length > 0) {
        let SubDetails = response['data'][0].find(x => x.SubProjectName === this.subProjectDetails.FlatNo);
        this.subProjectDetails.SubProjectId = SubDetails && SubDetails['SubProjectId'];
        this.getFloatedArchitectList(this.subProjectDetails, 'Customer_ReviewAll');
        this.isSpinnerActive = false;
      }
    });
  }
  // ********* get All Architects list with rating ********* //
  getArchitectForRating = (subproject) => {
    subproject.Action = 'Customer_Review';
    this.architectReviewSubscription = this.newProjectsService.getArchitectList(this.loggedInuserDetails, subproject).subscribe((response) => {
      if (response && response['data'] && response['data'][0].length > 0) {
        this.reviewconsultantList = response['data'][0];
        this.fileDetails = response['data'][1].reduce((r, a) => {
          r[a.ETExecutionId] = [...r[a.ETExecutionId] || [], a];
          return r;
        }, {});
        this.ratingnoDataFound = false;
      } else {
        this.ratingnoDataFound = true;
      }
      this.isSpinnerActive = false;
    });
  }

  //********* Floated work to Architects List *********//
  getFloatedArchitectList = (projectDetails, Input) => {
    projectDetails.Status = Input === 'Customer_Select' ? 'Selected' : null;
    projectDetails.Action = Input;
    this.architectListSubscription = this.newProjectsService.getArchitectList(this.loggedInuserDetails, projectDetails).subscribe((response) => {
      if (response && response['data'] && response['data'][0].length > 0) {
        this.architectList = response['data'][0];
        this.fileDetails = response['data'][1].reduce((r, a) => {
          r[a.ETExecutionId] = [...r[a.ETExecutionId] || [], a];
          return r;
        }, {});
        this.showDataNotFoundMessage = false;
        this.getSelectedArchitect(projectDetails);
      } else {
        this.showDataNotFoundMessage = true;
      }
      this.isSpinnerActive = false;
    });
  }
  // ****** selected architect Related Interactions Insert and get ****** // 
  architectForInteraction = (architect) => {
    if (this.loggedInuserDetails.UserType === 'Customer') {
      this.subprojectDetails['SiteId'] = architect['SiteId'];
      architect['SubProjectId'] = this.subProjectDetails['SubProjectId'];
      this.sharedService.architectInteraction(architect);
    }
  }
  // ********* Get Selected Architect ********* //
  getSelectedArchitect = (subprojectDetails) => {
    this.SelectedArchitectSubscription = this.newProjectsService.getSelectedArchitect(this.loggedInuserDetails, subprojectDetails).subscribe((response) => {
      if (response && response['data']) {
        this.architectList.forEach(element => {
          let architect = response['data'].some(x => x['VendorId'] === element['VendorId']);
          if (architect) {
            element['checked'] = true;
            this.loggedInuserDetails.UserType !== 'Customer' ? this.selectArchitect(element, true, this.selectedArchitectList) : null;
          } else {
            element['checked'] = false;
          }
        })
      }
    })
  }
  // ********* Selected Architect ********* //
  selectArchitect = (architect, checked: boolean, list) => {
    if (checked) {
      list.push(architect.VendorId);
    } else {
      let index = list.indexOf(architect.VendorId);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
  }
  // ********* Submit Selected Architect for subproject ********* //
  submitArchitectList = (selectArchitect) => {
    let architectDetails = [];
    // architectDetails['etExecutionId'] = this.loggedInuserDetails.UserType === 'Customer' ? selectArchitect['ETExecutionId'] : this.selectedArchitectList.join(',');
    architectDetails['etExecutionId'] = this.loggedInuserDetails.UserType === 'Customer' ? selectArchitect['ETExecutionId'] : null;

    architectDetails['SiteId'] = this.subProjectDetails['SiteId'];
    architectDetails['SubProjectId'] = this.subProjectDetails['SubProjectId'];
    architectDetails['VendorId'] = this.loggedInuserDetails.UserType === 'Customer' ? selectArchitect['VendorId'] : this.selectedArchitectList ? this.selectedArchitectList.join(',') : selectArchitect.VendorId;
    architectDetails['VendorType'] = this.loggedInuserDetails.UserType === 'Customer' ? selectArchitect['VendorType'] : this.selectedArchitectList && this.selectedArchitectList.map(ele => {
      return this.architectList.filter(x => x['VendorId'] === ele)[0]['VendorType'];
    }).join(',');
    this.finalarchitectSubscription = this.newProjectsService.selectedArchitect(this.loggedInuserDetails, architectDetails).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar('SuccessFully Selected');
      } else {
        this.showFailedBar('Not Selected SuccessFully');
      }
    });
  }
  // ********* Open Rating Modal Pop UP ********* //
  openRatingModal = (architect) => {
    this.architectDetails = architect;
    this.Portfolio = false;
    this.TitleModal = "Review And Rating For Work";
    this.alreadyRated = architect.Rating !== null ? true : false;     // if Rating is Already inserted then input "update"
    this.RatingModal.show();
  }
  // ********* Customer Rating Submit ********* //
  submitRating = (ratingDetails) => {
    ratingDetails['SVersionId'] = this.architectDetails['ETExecutionId'];
    ratingDetails['RatingType'] = 'ETExecution';
    ratingDetails['SubRatingType'] = 'CustomerRating';
    ratingDetails['SiteId'] = this.subProjectDetails['SiteId'];
    ratingDetails['VendorId'] = this.architectDetails['VendorId'];
    ratingDetails['VendorType'] = this.architectDetails['VendorType'];
    ratingDetails['RatingId'] = this.architectDetails['RatingId'];
    ratingDetails['SubProjectId'] = this.architectDetails['SubProjectId'];
    ratingDetails['Input'] = this.alreadyRated ? 'update' : 'Insert';
    this.ratingMasterInsertSubscription = this.newProjectsService.ratingMasterInsert(this.loggedInuserDetails, ratingDetails).subscribe((response) => {
      if (response && response['data']) {
        this.ratingDetails = <IRating>{};
        this.showSuccessBar('Rating Submitted SuccessFully');
        this.getArchitectForRating(this.subProjectDetails);
      } else {
        this.showFailedBar('Failed to Submit Rating');
      }
      this.RatingModal.hide();
    });
  }
  // ******* Open Design Brief and Show Selected options ******** //
  opendesignBrief = () => {
    this.DesignBriefModal.show();
    this.getAllDesignPrefrences();
  }
  // ******** OPT IN Declaration Form MOdal Pop *******//
  openOptin = () => {
    this.OptinFormModal.show();
    this.getSubmittedDesignBrief(true);
  }
  // ******** get All Design Brief Fields ******** //
  getAllDesignPrefrences = () => {
    const Input = "getAll";
    this.getDesignBriefDataSubscription = this.newProjectsService.getDesignBriefData(this.loggedInuserDetails, Input).subscribe((response) => {
      if (response && response['data']) {
        this.allPrefrences = response['data'];
        this.getSubmittedDesignBrief(false);
      }
    });
  }
  // ******* Select Design Brief Options Show ******** //
  onChange = (selected, checked: boolean, list) => {
    if (checked) {
      list.push(selected.CPSubId);
    } else {
      let index = list.indexOf(selected.CPSubId);
      (index !== -1) ? list.splice(index, 1) : null;
    }
  }
  // ******* Submit Selected Design Brief on Customer And project and SubProject ******** //
  submitDesignBrief = (designBriefModel) => {
    this.selectedList.push(designBriefModel.WaterStorage);
    this.selectedList.push(designBriefModel.Parking);
    this.selectedList.push(designBriefModel.BHK);
    designBriefModel.CpSubId = this.selectedList && this.selectedList.toString();
    designBriefModel.SiteId = this.subProjectDetails['SiteId'];
    designBriefModel.SubProjectId = this.subProjectDetails['SubProjectId'];
    this.customerSpecificationSubscription = this.newProjectsService.customerSpecification(this.loggedInuserDetails, designBriefModel, "INSERT").subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar(this.designBriefModel.OptIn === true ? 'Please Check Email and SMS For Login Url, Id and password' : 'Design Brief Submitted SuccessFully');
        this.designBriefModel.OptIn === true ? this.OptinFormModal.hide() : this.DesignBriefModal.hide();
      } else {
        this.showFailedBar(this.designBriefModel.OptIn === true ? 'Failed to Update' : 'Failed to Submit Design Brief');
      }
    });
  }
  // ******* Get Submitted Design Brief ******** //
  getSubmittedDesignBrief = (showinput) => {
    this.getSelectedPrefrencesSubscription = this.newProjectsService.getSelectedPrefrences(this.loggedInuserDetails, "GetById", this.subProjectDetails['SiteId'], this.subProjectDetails['SubProjectId']).subscribe((response) => {
      if (response && response['data']) {
        if (showinput) {
          this.designBriefModel['OptIn'] = response['data'][0][0] ? response['data'][0][0]['OptIn'] : false;
          this.disableForSelected = response['data'][0][0] && response['data'][0][0]['OptIn'] === true ? true : false;
        } else {
          let AllCpSubId = []
          this.allPrefrences.map(ele => {
            AllCpSubId = response['data'][0][0] && response['data'][0][0].CPSubId.split(',').map(Number);
            let result = AllCpSubId && AllCpSubId.some(x => Number(x) === Number(ele['CPSubId']));
            if (result) {
              ele['checked'] = true;
            }
          })
          let dBrief;
          dBrief = this.allPrefrences.reduce((r, a) => {          // for Group By the Design Brief By Prefrences             
            r[a['Preference']] = [...r[a['Preference']] || [], a];
            return r;
          }, {});
          this.designBrief = dBrief;
          this.keys = Object.keys(this.designBrief);                   // get parameter name of GroupBy
          if (response['data'][0][0]) {
            this.selectedList = AllCpSubId;
            this.designBriefModel = response['data'][0][0];
            this.details(1, 'Parking');
            this.details(5, 'WaterStorage');
            this.details(0, 'BHK');
          }
        }
      }
    });
  }
  details = (index, name) => {
    this.designBrief[this.keys[index]].map(ele => {
      const re = this.selectedList.some(x => Number(x) === Number(ele.CPSubId));
      if (re) {
        this.designBriefModel[`${name}`] = Number(ele.CPSubId);
        this.selectedList.splice(this.selectedList.indexOf(ele.CPSubId), 1);
      }
    });
  }
  //  ******* Portfolio of Architect ******** //
  showPortfolio = (architect) => {
    this.getarchitectData = [];
    this.Portfolio = true;
    this.RatingModal.show();
    this.TitleModal = "Portfolio";
    let arr;
    let des;
    arr = architect.Portfolio ? architect.Portfolio.split('*#*') : [];
    des = architect.Description ? architect.Description.split('*#*') : [];
    arr.forEach((element, index) => {
      this.getarchitectData.push({ filename: 'File' + [index + 1], Portfolio: element, Document: des[index] ? des[index] : null });
    });
  }

  //********** open selected file in new tab **********//
  openFileInNewTab = (fileUrl: string) => {
    window.open(fileUrl);
  }
  //********** open selected Weblink in new tab **********//
  openWebLinkInNewTab = (weblinkUrl: string) => {
    window.open('https://' + weblinkUrl + '/');
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
  ngOnDestroy() {
    this.architectListSubscription ? this.architectListSubscription.unsubscribe() : null;
    this.finalarchitectSubscription ? this.finalarchitectSubscription.unsubscribe() : null;
    this.SelectedArchitectSubscription ? this.SelectedArchitectSubscription.unsubscribe() : null;
    this.architectReviewSubscription ? this.architectReviewSubscription.unsubscribe() : null
    this.ratingMasterInsertSubscription ? this.ratingMasterInsertSubscription.unsubscribe() : null;
    this.getDesignBriefDataSubscription ? this.getDesignBriefDataSubscription.unsubscribe() : null;
    this.customerSpecificationSubscription ? this.customerSpecificationSubscription.unsubscribe() : null;
    this.getSelectedPrefrencesSubscription ? this.getSelectedPrefrencesSubscription.unsubscribe() : null;
    this.architectProfileDetailsSubscription ? this.architectProfileDetailsSubscription.unsubscribe() : null;
  }
}