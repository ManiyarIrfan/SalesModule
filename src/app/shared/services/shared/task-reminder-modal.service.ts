import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskReminderModalService {

  constructor(private http: HttpClient) { }

  allMeetingsInfomation = (user, meetingDeails, input) => {
    let data = {
      agendaItemId: meetingDeails.AgendaItemId ? meetingDeails.AgendaItemId : null,
      meetingId: meetingDeails.MeetingId ? meetingDeails.MeetingId : null,
      emailId: meetingDeails.UserEmail ? meetingDeails.UserEmail : null,
      input
    }
    const url = `${environment.executionApiUrl}api/MeetingModule/MeetingAgendaSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
}
