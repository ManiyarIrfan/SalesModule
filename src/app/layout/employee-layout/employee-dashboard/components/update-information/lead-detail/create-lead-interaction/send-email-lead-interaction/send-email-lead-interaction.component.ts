import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { PreSalesleadDetailsService } from 'src/app/shared/services/employee/pre-saleslead-details.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { Iemailmodel, IinteractionModel } from 'src/app/shared/models/employeeModel/lead-detail.model';

@Component({
  selector: 'tru-send-email-lead-interaction',
  templateUrl: './send-email-lead-interaction.component.html',
  styleUrls: ['./send-email-lead-interaction.component.scss']
})

export class SendEmailLeadInteractionComponent implements OnInit, OnChanges, OnDestroy {
  public showPdf = 'https://truimages.blob.core.windows.net/productionimages/Brochure/ProjectBrochure/';
  public hidePdfIcon: boolean = false;
  public HtmlDetails: string;
  public template: string;
  public mailType: string;
  public Brochure_Name: string[] = [];
  public Project_Name: string;
  public name = 'ng2-ckeditor';
  public ckeConfig: object;
  public To: string;
  public CC: string;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};

  public Attachment: string[] = [];
  public emailmodel: Iemailmodel = <Iemailmodel>{};
  public selectedProjectNames: string[] = [];
  public selectedBrochureNames: string[] = [];
  public showSelectedListNotFoundMessage: string = '';
  public isLoadingEmailSendSuccessfullyMessage: boolean = false;
  public disableEmailBtn: boolean = false;
  public interactionModel: IinteractionModel = <IinteractionModel>{};
  public showAlternativeEmail: boolean = false;
  public allAlternativeEmail: string[] = [];
  public selectedType: any = [
    { key: "false", value: "General Mail" },
    { key: "true", value: "Brochure" }];

  public onInteractionSubmitSubscription: Subscription;
  public onSendEmailSubscription: Subscription;
  public GetAllBrochureAndTemplateNameSubscription: Subscription;
  public GetAllProjectNameSubscription: Subscription;

  @ViewChild('showFileModel', { static: false }) public showFileModel: ModalDirective;
  @ViewChild("myckeditor", { static: false }) ckeditor: any;
  @Input() EnquiryId: any;

  constructor(
    private preSalesleadDetailsService: PreSalesleadDetailsService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.CC = this.loggedInuserDetails.UserEmail;
    }
    this.ckeConfig = {
      allowedContent: true,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: false,
      removePlugins: 'elementspath',
      removeButtons: 'Save',
      toolbarGroups: [
        { "name": "basicstyles", "groups": ["basicstyles"] },
        { "name": "paragraph", "groups": ["list", "align"] },
        { "name": "insert", "groups": ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'] },
        { "name": "document", "groups": ["mode"] },
        { "name": "styles", "groups": ["styles"] },
        { "name": "colors" },
        { "name": "tools", "groups": ["Maximize"] }
      ]
    };
    this.mailType = "";
    this.Project_Name = "";
    this.template = "";

    this.sharedService.changePresalesIneractionListener.subscribe((tabno) => {
      if(tabno !='')
      {
        this.emailmodel.Subject=tabno.Subject;
        this.emailmodel.Details=tabno.EmailBody;
      }  
  });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.EnquiryId && this.EnquiryId) {
      this.To = this.EnquiryId.Email !== null ? this.EnquiryId.Email : 'NA';
    }
  }

  GetTemplateContentInfo = () => {
    //-------Get All Project Names-------//
    this.preSalesleadDetailsService.GetTemplateContent(this.template).subscribe((response) => {
      if (response !== null && response['exception'] === null) {
        this.HtmlDetails = response['data'][0].Content;
        this.emailmodel.Details = this.HtmlDetails ? this.HtmlDetails.concat('<p>Thanks & Regards<br>' + this.loggedInuserDetails.Firstname + ' ' + this.loggedInuserDetails.LastName + '</p>') : null;
      } else if (response['exception'] !== null) {
        this.HtmlDetails = "No Data Found";
      }
    });
  }
  GetAllProjectName = (value) => {
    //-------Get All Project Names-------//
    this.GetAllProjectNameSubscription = this.preSalesleadDetailsService.GetProjectNameList(this.loggedInuserDetails, value).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedProjectNames = response["data"];
        if (this.mailType === '') {
          this.emailmodel = <Iemailmodel>{};
          this.Project_Name = "all";
        }
      }
    });
  }

  GetAllBrochureAndTemplateName = (ProjectName, mailType) => {
    //-------Select Brochure then Show its Project and Files-------//   
    this.GetAllBrochureAndTemplateNameSubscription = this.preSalesleadDetailsService.GetBrochureNameList(this.loggedInuserDetails, ProjectName, mailType).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedBrochureNames = response["data"];
        if (this.selectedBrochureNames && this.selectedBrochureNames[0]) {
          this.showSelectedListNotFoundMessage = ``;
        } else {
          this.showFailedBar("The Brochure/Template Is Not Available For Selected Project")
        }
      }
    });
  }

  onClickBrochureImageUrl = () => {
    //-------Select Brochure Name as Attachment Name-------//
    this.emailmodel['Attachment'] = this.Brochure_Name;
    this.hidePdfIcon = true;
  }

  onSendEmail = (emailmodel, sendMailForm) => {
    //-------To Send Email-------//
    //********** For ProjectName Store in Comma Seperated Format **********//
    let test = [];
    this.Brochure_Name.forEach((element) => {
      test.push(element['ProjectName']);
    });
    this.emailmodel['Attachment'] = test.join(',');
    this.isLoadingEmailSendSuccessfullyMessage = true;
    this.disableEmailBtn = true;
    this.onSendEmailSubscription = this.preSalesleadDetailsService.sendEmail(this.loggedInuserDetails, this.To, emailmodel).subscribe((response) => {
      if (response) {
        this.showSuccessBar(response);
      } else {
        this.showFailedBar("Email Not Sent");
      }
      this.isLoadingEmailSendSuccessfullyMessage = false;
      this.disableEmailBtn = false;
      this.hidePdfIcon = false;
      this.Brochure_Name = [];
      this.mailType = "";
      this.template = "";
      this.onInteractionSubmit();
    });
    //this.selectedBrochureNames = String(false);
    // this.selectedProjectNames =false;
    this.template = "";
    this.mailType = "General Mail";
    this.emailmodel = <Iemailmodel>{};
    sendMailForm.form.markAsPristine();
    sendMailForm.form.markAsUntouched();
  }

  onInteractionSubmit = () => {
    //-------After Successfully mail send Creating Interaction-------//
    this.interactionModel.interactionType = "Email";
    this.interactionModel.Details = 'Email Successfully Send to ' + this.To;
    this.onInteractionSubmitSubscription = this.preSalesleadDetailsService.insertInteractionStatus(this.loggedInuserDetails, this.interactionModel, this.EnquiryId).subscribe((response) => {
      if (response && response['successful']) {
        if (this.loggedInuserDetails.Role === 5 || this.loggedInuserDetails.Role === 11)
          this.sharedService.sharePresalesIneractionDetails(this.interactionModel);
        else
          this.sharedService.changeSalesIneractionDetails();
      }
    });
  }

  changeAltEmail = () => {
    //-------if more than Alternate Email split and show-------//
    this.showAlternativeEmail = true;
    this.allAlternativeEmail = this.EnquiryId.AlternateEmail && this.EnquiryId.AlternateEmail !== null && this.EnquiryId.AlternateEmail.split(',')
  }

  changePrimaryEmail = () => {
    //-------Show Primary Email-------//
    this.showAlternativeEmail = false;
    this.To = this.EnquiryId.Email;
  }

  onChangeAlternateEmail = (select) => {
    //-------Selected Email to send Email-------//
    this.To = select;
  }

  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['red-snackbar'] });
  }

  showSuccessBar = (message) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy() {
    this.onInteractionSubmitSubscription ? this.onInteractionSubmitSubscription.unsubscribe() : null;
    this.onSendEmailSubscription ? this.onSendEmailSubscription.unsubscribe() : null;
    this.GetAllBrochureAndTemplateNameSubscription ? this.GetAllBrochureAndTemplateNameSubscription.unsubscribe() : null;
    this.GetAllProjectNameSubscription ? this.GetAllProjectNameSubscription.unsubscribe() : null;
  }
}