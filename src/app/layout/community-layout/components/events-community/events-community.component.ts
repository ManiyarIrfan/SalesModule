import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';


@Component({
  selector: 'app-events-community',
  templateUrl: './events-community.component.html',
  styleUrls: ['./events-community.component.scss']
})
export class EventsCommunityComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: any[] = [];
  public FbPosts: any[] = [];

  public Posts = [
    { post: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftrurealty.in%2Fposts%2F617665962192376&width=500' },
    { post: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftrurealty.in%2Fposts%2F616963505595955&width=500' },
    { post: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftrurealty.in%2Fposts%2F610289912929981&width=500' },
  ]

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _discussionService: DiscussionService) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails !== null) {
      this.getPosts();
    }
  }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'Events' } });
    } else {
      this.getPosts();
    }
  }

  photoURL(item) {
    let url;
    url = this._sanitizer.bypassSecurityTrustResourceUrl(item);
    return url;
  }

  getPosts = () => {
    const SearchModel = [];
    SearchModel['Input'] = 'SearchByStakeholder';
    SearchModel['DocType'] = 'FacebookPosts';
    SearchModel['StakeholderType'] = 'Customer';
    const GetDocumentCategoryService = this._discussionService.getFBPosts(this.loggedInuserDetails, SearchModel)
      .subscribe((response) => {
        if (response && response['data']) {
          this.FbPosts = response['data'][0];
        }
      });
    this._unsubscribeAll.push(GetDocumentCategoryService);
  }

  ngOnDestroy() {
    for (const item of this._unsubscribeAll) {
      item.unsubscribe();
    }
    this._unsubscribeAll = [];
  }
}
