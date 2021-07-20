import { Component, OnInit, HostListener, ViewChild, NgZone } from '@angular/core';
import { IIdeaInsertModal } from 'src/app/shared/models/Idea/idea-modal';
import { IdeathonService } from 'src/app/shared/services/shared/ideathon.service';
import { Subscription } from 'rxjs';
import { FileAttachment } from '../file-upload/file-attachment.model';
import { MatSnackBar } from '@angular/material';
//import { ModalDirective } from 'ngx-bootstrap';
import { ModalDirective } from 'angular-bootstrap-md';
import { DomSanitizer } from '@angular/platform-browser';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
const popupData: object = {
  submit: {
    warMsg: 'Are you sure you want to Submit Idea?',
    susMsg: 'Idea Successfully Submitted.',
    unsMsg: 'Could Not Submit Idea,Please Contact in Office.'
  },
  Update: {
    warMsg: 'Are you sure you want to Update Idea?',
    susMsg: 'Your idea Successfully Updated.',
    unsMsg: 'Could Not Update idea,Please Contact in Office.'
  },
  Post: {
    warMsg: 'Are you sure you want to post comment?',
    susMsg: 'Your idea Comment Successfully added.',
    unsMsg: 'Could Not add your comment,Please Contact in Office.'
  }
}
@Component({
  selector: 'tru-idea-module',
  templateUrl: './idea-module.component.html',
  styleUrls: ['./idea-module.component.scss']
})
export class IdeaModuleComponent implements OnInit {
  @ViewChild('actionWarningModal', { static: false }) public actionWarningModal: ModalDirective
  @ViewChild('ActionRatingForm', { static: false }) public ActionRatingForm: ModalDirective
  @ViewChild('VoteFormModal', { static: false }) public VoteFormModal: ModalDirective
  public loggedInuserDetails: any = [];
  public allideaModel: IIdeaInsertModal = <IIdeaInsertModal>{};
  public getProjectNameDropDownsub: Subscription;
  public insertUpdate_IdeaSubscription: Subscription;
  public GetIdeaDetailsSubscription: Subscription;
  public insertUpdate_IdeaReviewSubscription: Subscription;
  public GetIdeaReviewSubscription: Subscription;
  public GetIdeaSubscription: Subscription;
  public GetIdeaCommentsSubscription: Subscription;
  public insert_IdeaCommentsSubscription: Subscription;
  public showCreateIdeaForm: boolean = false;
  public showTableForlink: boolean = false;
  public disabledBtn: boolean = false;
  public commentOpened: number;
  public checkedindex: number;
  public allIdeaDetails: object[] = [];
  public filterallIdeaDetails: object[] = [];
  public allIdea_ReveiwDetails: object[] = [];
  public IdeaDeatils: any[] = [];
  public EmployeeName: object[] = [];
  public allIdeaComments: object[] = [];
  public filterIdeaComments: object[] = [];
  public userrating: object[] = [];
  public GraphData: object[] = [];
  public UsergraphDate: object[] = [];
  public filteRemak: object[] = [];
  public PopularIdeas: object[] = [];
  public WinnerData: object[] = [];
  public IdeaImageUrls: string[] = [];
  public uploadIdeafile: FileAttachment[] = [];
  public NumberforVote: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public stars: number[] = [1, 2, 3, 4, 5];
  public selectedValue: number;
  public filterColumnModal: string[] = [];
  public TableName: string;
  private chart: am4charts.PieChart;
  private chart2: am4charts.XYChart;
  public IdeaDetailsTemp: any[] = [];
  public showImageForUpdate: boolean = false;
  public currentStep: number;
  public DeletedFile: string[] = [];
  public showUpdateBtn: boolean = false;
  public LockIdeaName: boolean = false;
  public term: string;
  public rateMsg: string = null;
  public postComment: boolean = false;
  public commentShowID: number = -1;
  public myCount: number;
  public allcount: number;
  public showRemarkandScore: boolean = false;
  public clickedIndex: number;
  public RemarkOpen: number;
  public openStatusform: number;
  public clickedStatusIndex: number;
  public showchart: boolean = false;
  public p: number;
  constructor(private ideathonService: IdeathonService, private _sanitizer: DomSanitizer, private zone: NgZone,
    private snackBar: MatSnackBar) { }
  public getHeader = ['Already Exists', 'Likely To Implement', 'Planned', 'Will Not Implement', 'In Production'];
  public moduleDetails: any = [
    { key: "HR", value: "HR" },
    { key: "Execution", value: "Execution" },
    { key: "DND", value: "DND" },
    { key: "Marketing", value: "Marketing" },
    { key: "Presales", value: "Presales" },
    { key: "Sales", value: "Sales" },
    { key: "Customer", value: "Customer" },
    { key: "ChannelPartner", value: "ChannelPartner" },
    { key: "CRO", value: "CRO" },
    { key: "Other", value: "Other" },
  ];
  public tableHeader = [
    { key: 'IdeaId', ColName: 'Idea Id' },
    { key: 'Subject', ColName: 'Idea Name' },
    { key: 'ProcessArea', ColName: 'Process Area' },
    { key: 'IdeaRating', ColName: 'Average Rating' },
    { key: 'Status', ColName: 'Status' },
    { key: 'CreatedOn', ColName: 'Created On' },
    { key: 'Name', ColName: 'Created By' },
    { key: 'Action', ColName: 'Action' }
  ];
  public EvaluationtableHeader = [
    { key: 'Name', ColName: 'Name' },
    { key: 'Viability', ColName: 'Viability' },
    { key: 'Desirablity', ColName: 'Desirablity' },
    { key: 'Feasibility', ColName: 'Feasibility' },
    { key: 'OriginalityOfConcept', ColName: 'Originality' },
    { key: 'Remark', ColName: 'Remark' },
    { key: 'Totalscore', ColName: 'Total Score' },
    { key: 'UpdatedOn', ColName: 'Date' }
  ];
  ngOnInit() {
    //this.spinner.show();
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.showchart = true;
    this.GetIdea_DashboardDetails();
    this.GetIdea_Review();
  }
  //get IdeaReview and idea details all
  GetIdea_DashboardDetails = () => {
    //this.spinner.show();
    this.allideaModel['IdeaId'] = null;
    this.GetIdeaSubscription = this.ideathonService.GetIdea_ReveiwDetails(this.loggedInuserDetails, 'DashBoard', this.allideaModel['IdeaId']).subscribe((response) => {

      this.GraphData = (response['data'][0] && response['data'][0] && response['data'][0].length > 0) ? response['data'][0] : [];
      this.UsergraphDate = (response['data'][1] && response['data'][1] && response['data'][1].length > 0) ? response['data'][1] : [];
      this.PopularIdeas = (response['data'][2] && response['data'][2] && response['data'][2].length > 0) ? response['data'][2] : [];
      this.WinnerData = (response['data'][3] && response['data'][3] && response['data'][3].length > 0) ? response['data'][3] : [];
      this.IdeaDeatils = this.IdeaDetailsTemp = (response['data'][4] && response['data'][4] && response['data'][4].length > 0) ? response['data'][4] : [];
      this.allcount = this.IdeaDeatils.length;
      this.allIdeaDetails = this.IdeaDeatils.filter(x => x['EmployeeId'] === this.loggedInuserDetails['EntityId']);
      this.myCount = this.allIdeaDetails.length;
      //this.spinner.hide();

      if (this.showchart === true) {
        this.chart = am4core.create('chartd', am4charts.PieChart);
        this.chart.responsive.enabled = true;
        am4core.useTheme(am4themes_animated);
        this.chart.data = response['data'][0];
        var series = this.chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "Ideacount";
        series.dataFields.category = "Status";
        series.labels.template.disabled = true;
        series.ticks.template.disabled = true;
        this.chart.legend = new am4charts.Legend();
        this.chart.legend.fontSize = 12;
        this.chart.legend.position = "right";
        this.chart.legend.valign = "top";

        this.chart2 = am4core.create("chartdiv", am4charts.XYChart);
        this.chart2.data = response['data'][1];
        var categoryAxis = this.chart2.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "EmployeeName";
        categoryAxis.numberFormatter.numberFormat = "#";
        categoryAxis.renderer.inversed = true;
        var valueAxis = this.chart2.xAxes.push(new am4charts.ValueAxis());
        var seriess = this.chart2.series.push(new am4charts.ColumnSeries());
        seriess.dataFields.valueX = "IdeaCount";
        seriess.dataFields.categoryY = "EmployeeName";
        seriess.columns.template.propertyFields.fill = "color";
        seriess.columns.template.tooltipText = "{valueX}";
        seriess.columns.template.column.stroke = am4core.color("#fff");
        seriess.columns.template.column.strokeOpacity = 0.2;
        categoryAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.grid.template.disabled = true;
      }
    });
  }
  //get Review 
  GetIdea_Review = () => {
    this.GetIdeaReviewSubscription = this.ideathonService.GetIdea_ReveiwDetails(this.loggedInuserDetails, 'Review', null).subscribe((response) => {
      this.allIdea_ReveiwDetails = (response['data'][0] && response['data'][0] && response['data'][0].length > 0) ? response['data'][0] : [];

    });
  }
  //get all idea comments
  GetIdea_Comments = () => {
    this.GetIdeaCommentsSubscription = this.ideathonService.GetIdea_ReveiwDetails(this.loggedInuserDetails, 'Comments', null).subscribe((response) => {
      this.allIdeaComments = (response['data'][0] && response['data'][0] && response['data'][0].length > 0) ? response['data'][0] : [];
      if (this.commentShowID !== -1) {
        this.postComment = true;
        this.getComments(this.commentOpened, this.IdeaDeatils[this.commentOpened]);
        this.commentShowID = -1;
      }
    });
  }
  //**********insert Update idea details idea***********//
  AddIdea = () => {
    this.showCreateIdeaForm = true;
    this.LockIdeaName = false;
  }
  closeForm = () => {
    this.allideaModel = <IIdeaInsertModal>{};
    this.showCreateIdeaForm = false;
    this.showImageForUpdate = false;
    this.showUpdateBtn = false;
    this.closetable();
    this.GetIdea_DashboardDetails();
    this.DeletedFile = [];
    this.uploadIdeafile = [];
  }
  emitRequest = (data) => {
    this.LockIdeaName = true;
    this.disabledBtn = false;
    this.showCreateIdeaForm = true;
    this.showUpdateBtn = true;
    this.allideaModel = Object.assign({}, data);
    this.allideaModel['IdeaStatus'] = data['Status'];
    this.IdeaImageUrls = (data && data['ImageUrl'] && data['ImageUrl'] !== '') ? data.ImageUrl.split('*#*') : [];
    this.showImageForUpdate = (data['ImageUrl'] && data['ImageUrl'] !== '') ? true : false;
  }
  deleteideaFile = (file) => {
    this.DeletedFile.push(file);
    //this.allideaModel['DeleteFileUrl'] = file;
    let index = this.IdeaImageUrls.findIndex(x => x === file);
    (index !== -1) ? this.IdeaImageUrls.splice(index, 1) : null;
  }
  ChangeStatus = (details, i) => {
    this.allideaModel = details;
    this.allideaModel['IdeaId'] = details.IdeaId;
    this.allideaModel['IdeaStatus'] = details.IdeaStatus;
    this.disabledBtn = false;
    if (this.openStatusform !== i) {
      this.clickedStatusIndex = i;
      this.openStatusform = i;
    }
    else {
      this.clickedStatusIndex = -1;
      this.openStatusform = -1;
    }
  }
  showPopupForAction = (key) => {
    this.allideaModel['PopupWarningMsg'] = popupData[key]['warMsg'];
    this.allideaModel['Status'] = key;
    this.actionWarningModal.show();
  }
  closepopUpforaction = () => {
    this.actionWarningModal.hide();
    this.GetIdea_DashboardDetails();
    this.GetIdea_Review();
  }
  insertUpdate_IdeaDetails = () => {
    this.disabledBtn = true;
    this.allideaModel['DbImageUrlList'] = (this.allideaModel.ImageUrl && this.allideaModel.ImageUrl !== '') ? this.allideaModel.ImageUrl : null;
    this.allideaModel['DeleteFileUrl'] = this.DeletedFile.join(',');
    this.allideaModel['input'] = 'Idea Insert';
    this.insertUpdate_IdeaSubscription = this.ideathonService.insertUpdate_all(this.loggedInuserDetails, this.allideaModel, this.uploadIdeafile).subscribe((response) => {
      if (response)
        this.showSuccessBar(popupData[this.allideaModel['Status']]['susMsg']);
      else {
        this.showFailedBar(popupData[this.allideaModel['Status']]['unsMsg']);
      }
      this.actionWarningModal.hide();
      this.GetIdea_DashboardDetails();
      this.closeForm();
    });
  }
  //**********get non-editable average rating**************//
  getrating = (details) => {
    let name;
    name = "--rating : " + details.IdeaRating;
    return this._sanitizer.bypassSecurityTrustStyle(name);
  }
  //****************table data*********************//  
  closetable = () => {
    this.showTableForlink = false;
    this.TableName = '';
    this.GetIdea_DashboardDetails();
  }
  showDetails = (head) => {
    switch (head) {
      case 'My Ideas': this.filterallIdeaDetails = this.IdeaDeatils.filter(x => x['CreatedBy'] === this.loggedInuserDetails.EntityId.toString()); break;
      case 'All Ideas': this.filterallIdeaDetails = this.IdeaDeatils; break;
      case 'Already Exists': this.filterallIdeaDetails = this.IdeaDeatils.filter(x => x['Status'] === 'Already Exists'); break;
      case 'Planned': this.filterallIdeaDetails = this.IdeaDeatils.filter(x => x['Status'] === 'Planned'); break;
      case 'Will Not Implement': this.filterallIdeaDetails = this.IdeaDeatils.filter(x => x['Status'] === 'Will Not Implement'); break;
      case 'Likely To Implement': this.filterallIdeaDetails = this.IdeaDeatils.filter(x => x['Status'] === 'Likely To Implement'); break;
      case 'In Production': this.filterallIdeaDetails = this.IdeaDeatils.filter(x => x['Status'] === 'In Production'); break;
      case 'new': this.filterallIdeaDetails = this.IdeaDeatils.filter(x => x['Status'] === 'New'); break;
    }
    this.showTableForlink = true;
    this.TableName = head;
  }
  CheckTabIndex = (event) => {
    if (event.index === 0 || event.index === 2) {
      this.IdeaDeatils = this.IdeaDetailsTemp;
      this.currentStep = event.index;
    }
    if (event.index === 0) {
      this.showchart = true;
    }
    if (event.index === 1 || event.index === 2) {
      this.showchart = false;
      this.GetIdea_Comments();
    }
  }
  gotoreview = (data) => {
    let tempdata;
    tempdata = this.IdeaDeatils.find(x => x.IdeaId === data.IdeaId)
    this.IdeaDeatils = Array.of(tempdata)
    this.currentStep = 1;
  }
  //*****************insert comments**********************//
  insert_IdeaComments = (IdeaId) => {
    this.allideaModel['input'] = 'Comment Insert';
    this.insert_IdeaCommentsSubscription = this.ideathonService.insertUpdate_all(this.loggedInuserDetails, this.allideaModel, null).subscribe((response) => {
      if (response) {
        this.showSuccessBar(popupData[this.allideaModel['Status']]['susMsg']);
      }
      else {
        this.showFailedBar(popupData[this.allideaModel['Status']]['unsMsg']);
      }
      this.commentShowID = IdeaId;
      this.showchart = false;
      this.GetIdea_DashboardDetails();
      this.GetIdea_Review();
      this.GetIdea_Comments();
      this.allideaModel = <IIdeaInsertModal>{};
    });
  }
  //****get comments for id******//
  getComments = (i, details) => {
    if (this.postComment || this.commentOpened !== i) {
      this.checkedindex = i;
      this.commentOpened = i;
      this.GetIdea_Comments();
      this.filterIdeaComments = this.allIdeaComments.filter(x => x['IdeaId'] === details.IdeaId);
      this.postComment = false;
    }
    else {
      this.checkedindex = -1;
      this.commentOpened = -1;
    }
    this.allideaModel['IdeaId'] = details.IdeaId;
    this.allideaModel['PopupWarningMsg'] = popupData['Post']['warMsg'];
    this.allideaModel['Status'] = 'Post';
  }
  //****************rate idea ,feedback ,insert update ideaReview  *************************//
  RateThisIdea = (details) => {
    this.allideaModel['IdeaId'] = details.IdeaId;
    this.allIdea_ReveiwDetails.filter(x => (x['IdeaId'] === details.IdeaId) && (x['CreatedBy'] === this.loggedInuserDetails.EntityId.toString()) ? this.selectedValue = x['IdeaRating'] : null);
    this.userrating = this.allIdea_ReveiwDetails.filter(x => x['IdeaId'] === details.IdeaId);
    this.ActionRatingForm.show();
  }
  closeratingform = () => {
    this.ActionRatingForm.hide();
    this.selectedValue = 0;
  }
  UpdateIdea_Review = (star, key) => {
    this.selectedValue = star;
    this.allideaModel['PopupWarningMsg'] = popupData[key]['warMsg'];
    this.allideaModel['Status'] = key;
    this.insertUpdate_IdeaReview(star);
  }
  voteIdea = (details) => {
    this.allideaModel = <IIdeaInsertModal>{};
    this.allideaModel.IdeaId = details.IdeaId;
    this.allideaModel.IdeaRating = details.IdeaRating;
    this.rateMsg = null;
    details.IdeaRating === "0" ? this.rateMsg = 'Rate This Idea First!!' : null;
    this.VoteFormModal.show()
  }
  InsertUpdateIdea_votes = (key) => {
    this.allideaModel['PopupWarningMsg'] = popupData[key]['warMsg'];
    this.allideaModel['Status'] = key;
    this.insertUpdate_IdeaReview(this.allideaModel['IdeaRating']);
  }
  insertUpdate_IdeaReview = (starValue) => {
    this.allideaModel['input'] = 'Review Insert';
    this.allIdea_ReveiwDetails.filter(e => (this.allideaModel['IdeaId'] === e['IdeaId']) && (this.loggedInuserDetails.EntityId.toString() === e['CreatedBy']) ? this.allideaModel['IdeaReviewId'] = e['IdeaReviewId'] : null);
    this.allideaModel['IdeaRating'] = starValue;
    this.insertUpdate_IdeaReviewSubscription = this.ideathonService.insertUpdate_all(this.loggedInuserDetails, this.allideaModel, this.uploadIdeafile).subscribe((response) => {
      if (response)
        this.showSuccessBar(popupData[this.allideaModel['Status']]['susMsg']);
      else {
        this.showFailedBar(popupData[this.allideaModel['Status']]['unsMsg']);
      }
      this.VoteFormModal.hide()
      this.showchart = false;
      this.GetIdea_DashboardDetails();
      this.GetIdea_Review();
      this.closeForm();
    });
  }
  FilterRemarkVoteForIdea = (i, details) => {
    this.filteRemak = this.allIdea_ReveiwDetails.filter(x => x['IdeaId'] === details.IdeaId && x['Totalscore'] !== 0);
    if (this.RemarkOpen !== i) {
      this.clickedIndex = i;
      this.RemarkOpen = i;
    }
    else {
      this.clickedIndex = -1;
      this.RemarkOpen = -1;
    }
  }
  //********** show snackbar for message **********//
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['red-snackbar'] });
  }
  deleteFileUrl = (data, index) => {
    if (this.allideaModel['DbImageUrlList'] && this.allideaModel['DbImageUrlList'].length > 0) {
      const i = this.allideaModel['DbImageUrlList'].findIndex(x => x === data['FullUrl']);
      (i !== -1) ? this.allideaModel['DeleteFileUrlList'].push(data['FullUrl']) : null;
    }
    (index !== -1) ? this.uploadIdeafile.splice(index, 1) : null;
  }
  // ******** Successfully and unsuccessfully message hide click on screen *********//
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    this.snackBar.dismiss();
  }
  //********** Used for NgFor to unique Id Everytym **********//
  trackByFn = (item) => {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy = () => {
    this.insertUpdate_IdeaSubscription ? this.insertUpdate_IdeaSubscription.unsubscribe() : null;
    this.GetIdeaDetailsSubscription ? this.GetIdeaDetailsSubscription.unsubscribe() : null;
    this.insertUpdate_IdeaReviewSubscription ? this.insertUpdate_IdeaReviewSubscription.unsubscribe() : null;
    this.GetIdeaReviewSubscription ? this.GetIdeaReviewSubscription.unsubscribe() : null;
    this.GetIdeaCommentsSubscription ? this.GetIdeaCommentsSubscription.unsubscribe() : null;
    this.insert_IdeaCommentsSubscription ? this.insert_IdeaCommentsSubscription.unsubscribe() : null;
    this.GetIdeaSubscription ? this.GetIdeaSubscription.unsubscribe() : null;
    this.chart.dispose();
    this.chart2.dispose();
  }
} 
