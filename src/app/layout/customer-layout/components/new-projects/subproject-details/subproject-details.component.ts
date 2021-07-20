import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { NewProjectsService } from 'src/app/shared/services/customer/new-projects.service';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'app-subproject-details',
  templateUrl: './subproject-details.component.html',
  styleUrls: ['./subproject-details.component.scss']
})
export class SubprojectDetailsComponent implements OnInit, OnDestroy {
  @Input() siteDetail;
  @Output() subprojectDetailsEvent = new EventEmitter<boolean>();
  @ViewChild('fileModel', { static: false }) public fileModel: ModalDirective;

  public loggedInuserDetails: IloggedInuserDetails[] = [];
  public subprojectList: string[] = [];
  public showArchitectDetails: boolean = false;
  public subProjectDetails: string[] = [];
  public siteName: string = '';
  public subProjectName: string = '';
  public isSpinnerActive: boolean = true;
  public subProjectFile: string[] = [];

  public subProjectListSubscription: Subscription;
  public subProjectDoc: string[] = [];

  constructor(private newProjectsService: NewProjectsService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.siteDetail && this.siteDetail) {
      if (localStorage.getItem('LoggedinUser')) {
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser')); //********** get User Details from Local Storage
        this.isSpinnerActive = true;
        this.getAllPlotlist(this.siteDetail);
      }
    }
  }

  // ********* Get SubProjectList ********* //
  getAllPlotlist = (siteDetail) => {
    let Action = 'SearchBySite';
    this.subProjectListSubscription = this.newProjectsService.getSiteDetails(this.loggedInuserDetails, siteDetail, Action).subscribe((response) => {
      if (response && response['data'] && response['data'][1]) {
        this.subprojectList = response['data'][1];
        this.isSpinnerActive = false;
        this.siteName = response['data'][0][0].SiteName;
        this.subProjectFile = response['data'][5] && response['data'][5];
      }
    });
  }

  // ********* Get SubProjectList ********* //
  getArchitect = (subproject) => {
    subproject.Type = "Design Competition";
    this.subProjectDetails = subproject;
    this.showArchitectDetails = true;
    this.subProjectName = subproject.SubProjectName;
  }
  // ***** Show Subprject Documents **** //
  showSubProjectFiles = (subproject) => {
    this.fileModel.show();
    this.subProjectDoc = [];
    this.subProjectDoc = this.subProjectFile.filter(x => x['SubProjectId'] === subproject['SubProjectId'])
  }
  // ********** open selected file in new tab **********//
  openFileInNewTab = (fileDetails) => {
    window.open(fileDetails);
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  ngOnDestroy() {
    this.subProjectListSubscription ? this.subProjectListSubscription.unsubscribe() : null;
  }
}
