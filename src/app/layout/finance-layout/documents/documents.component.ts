import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';

const assetPath = '../../../../assets/images/';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  searchtext: string = '';
  p1: number;
  documentList: string[] = [];
  Flag: boolean;
  docDetails: any = {};

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(private financeService: FinanceService) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
  }

  ngOnInit() {
    this.getDocs();
  }

  // Insert New Document
  createNew = () => {
    this.Flag = true;
  }

  // get Inserted Docs
  getDocs = () => {
    const getDocSub = this.financeService.getuploadDocs(this.loggedInuserDetails, { Input: 'Search', DocumentId: null })
      .subscribe((response) => {
        if (response && response['data']) {
          this.documentList = response['data'];
        }
      });
    this._unsubscribeAll.push(getDocSub);
  }

  //get Formated Data from UI
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
    return item;
  }

  // open selected file in new tab  
  openFileInNewTab = (fileUrl: string) => {
    window.open(fileUrl);
  }

  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    for (let item of this._unsubscribeAll) {
      item.unsubscribe();
    }
  }
}
