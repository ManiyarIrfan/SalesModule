import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskReminderModalService } from 'src/app/shared/services/shared/task-reminder-modal.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-reminder-modal',
  templateUrl: './task-reminder-modal.component.html',
  styleUrls: ['./task-reminder-modal.component.scss']
})
export class TaskReminderModalComponent implements OnInit {
  @ViewChild('showActionItemsModal', { static: false }) public showActionItemsModal: ModalDirective;

  public loggedInuserDetails: any = [];
  public Tasklist: string[] = [];
  public ActionItemslist: string[] = [];
  public p: number;
  public q: number;
  public allMeetingsInfomationSubScribe: Subscription;
  constructor(private taskReminderModalService: TaskReminderModalService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getActionItemsandTask('GetActionItemsById', []);
  }
  // ****** get Task / Action Items Related Details ***** //
  getActionItemsandTask = (input, meetingDetails) => {
    meetingDetails.UserEmail = this.loggedInuserDetails.UserEmail;
    this.allMeetingsInfomationSubScribe = this.taskReminderModalService.allMeetingsInfomation(this.loggedInuserDetails, meetingDetails, input).subscribe((response) => {
      if (response && response['data']) {
        this.Tasklist = response['data'][1].filter(x => x.Status && x.Status !== 'Completed' && x.DueDate.split('T')[0] >= new Date().toISOString().split('T')[0]);
        this.ActionItemslist = response['data'][0].filter(x => x.Status && x.Status !== 'Completed' && (x.DueDate).split('T')[0] >= new Date().toISOString().split('T')[0]);
        (this.Tasklist.length === 0 && this.ActionItemslist.length === 0) ? this.showActionItemsModal.hide() : this.showActionItemsModal.show();
      }
    })
  }
  trackByFn = (item) => {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy(): void {
    this.allMeetingsInfomationSubScribe ? this.allMeetingsInfomationSubScribe.unsubscribe() : null;
  }
}
