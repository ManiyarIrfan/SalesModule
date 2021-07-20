import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { NewProjectsService } from 'src/app/shared/services/customer/new-projects.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IarchitectProjDetails, IInteractionModel } from 'src/app/shared/models/Customer/new-project.model';

@Component({
  selector: 'app-interact-details',
  templateUrl: './interact-details.component.html',
  styleUrls: ['./interact-details.component.scss']
})
export class InteractDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('InteractionForm', { static: false }) public InteractionForm: any;

  public InteractionModel: IInteractionModel = <IInteractionModel>{};
  public loggedInuserDetails: IloggedInuserDetails[] = [];
  // public getAllInteractions: IgetAllInteractions=<IgetAllInteractions>{};
  public getAllInteractions: string[] = [];
  public floatedArchitect: string[] = [];
  public architectProjDetails: IarchitectProjDetails = <IarchitectProjDetails>{};
  public TakeNotesSubscription: Subscription;
  public GetDetailsSubscription: Subscription;

  constructor(private newProjectsService: NewProjectsService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.sharedService.changearchitectInteractionListener.subscribe((response) => {
      if (response) {
        this.architectProjDetails = response;
        this.getDetails(this.architectProjDetails);
      }
    });
  }

  //********* Create A Note *********//
  onCreateNote = (interactionDetails) => {
    interactionDetails.Input = 'Note';
    this.TakeNotesSubscription = this.newProjectsService.InsertInteraction(this.loggedInuserDetails, interactionDetails, this.architectProjDetails).subscribe((response) => {
      if (response && response["successful"]) {
        this.showSuccessBar("Interaction Inserted Successfully");
      } else {
        this.showFailedBar("Interaction Insertion Failed");
      }
      this.getDetails(this.architectProjDetails);
    });
    this.InteractionForm.reset();
    this.InteractionForm.form.markAsPristine();
    this.InteractionForm.form.markAsUntouched();
  }

  //********* Get All Notes from Database *********//
  getDetails = (siteDetail) => {
    this.getAllInteractions = [];
    siteDetail.Input = 'Get_ArchitectInteraction';
    this.GetDetailsSubscription = this.newProjectsService.getNotesDetails(this.loggedInuserDetails, siteDetail).subscribe((response) => {
      if (response && response["data"].length > 0) {
        this.getAllInteractions = response["data"];
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
    return item.id;
  }

  ngOnDestroy() {
    this.TakeNotesSubscription ? this.TakeNotesSubscription.unsubscribe() : null;
    this.GetDetailsSubscription ? this.GetDetailsSubscription.unsubscribe() : null;
  }
}
