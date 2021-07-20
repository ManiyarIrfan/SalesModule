import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { FileAttachment, FileUploadModel, Metadata } from 'src/app/shared/components/file-upload/file-attachment.model';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { catchError, last, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-community-file-upload',
  templateUrl: './community-file-upload.component.html',
  styleUrls: ['./community-file-upload.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CommunityFileUploadComponent implements OnInit {
  public inputMetadata = [];
  public disabled: boolean
  public documentName: string;
  public inputFiles: FileAttachment[] = [];
  public files = [];
  public target = 'https://file.io';
  public param = 'file';
  public metadata: Metadata[] = [];
  public ProfilePic: string = '../../../../../assets/community/search-icon.png';
  @Output() complete = new EventEmitter<string>();
  @Input() accept;
  @Input() ClearFile: boolean;
  @Output() inputFilesUpdated: EventEmitter<any>;
  @Input() text: string;
  @Input() Type: string;
  @Input() UploadDone: boolean;
  @Input() disabledBtn: boolean;
  @Output() getuploadedFile = new EventEmitter<any>();
  @Output() removeFile = new EventEmitter<boolean>();
  @Input() multiple;

  constructor(private _sanitizer: DomSanitizer, private _http: HttpClient,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.ProfilePic;
  }
  ngOnChanges(currentChanges: SimpleChanges): void {
    if (currentChanges.Type && this.Type) {
      this.Type;
    }
    // if (currentChanges.UploadDone && this.UploadDone) {
    //   // this.inputFiles = [];
    //   this.ProfilePic = '../../../../../assets/community/search-icon.png';
    // }
    if (this.ClearFile) {
      this.inputFiles = [];
      this.files.forEach(file => {
        this.cancelFile(file)
      });
    }
  }

  // add documents in temp table & view
  onAddDoc = () => {
    // this.newGroupModel.DisableDocTypeFlag = true;
    let DocData = [];
    if (this.inputFiles.length > 0) {
      //   let Filelength = Number(this.inputFiles[0].name.lastIndexOf('.'));
      let Type = this.inputFiles[0].type;
      DocData['DocUrl'] = 'data:' + Type + ';base64,' + (this._sanitizer.bypassSecurityTrustResourceUrl(this.inputFiles[0].content) as any).changingThisBreaksApplicationSecurity
      // DocData['Extension'] = this.inputFiles[0].name.substr(Filelength + 1)
    }
    this.ProfilePic = (DocData['DocUrl'])
  }

  // view uploaded docs
  // viewDocFile = (data) => {
  //   const TempExtension = data.Extension ? data.Extension : data.DocExtension;
  //   let Extendata = ['png', 'PNG', 'jpeg', 'jpg', 'JPG', 'JPEG']
  //   if (Extendata.find(c => TempExtension.includes(c))) {
  //     this.ViewDocModel.show();
  //     this.viewImg = data.DocUrl;
  //   }
  // }
  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        if (file.size / 1024 / 1024 <= 5) {
          this.files.push({
            data: file, state: 'in',
            inProgress: false, progress: 0, canRetry: false, canCancel: true
          });
        } else {
          this.snackBar.open('File Size is more than 5MB.Please Compress the file and Upload Or Contact in office.', 'Close', { duration: 10000 });
        }
      }
      let test = [];
      if (fileUpload.files != null) {
        test.push({ files: fileUpload.files });
        this.onFileSelect(test[0]);
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }
  onFileSelect(event) {
    // if (!this.showUploadButton) {
    for (const file of event.files) {
      if (file.size / 1024 / 1024 <= 5) {
        if (this.isFileTypeAllowed(file)) {
          const indexOfExistingFile: number = this.inputFiles.findIndex(item => item.name === file.name);
          if (-1 !== indexOfExistingFile) {
            this.inputFiles.splice(indexOfExistingFile, 1);
          }
          this.addFileObject(file);
        } else {
          const i = this.files.findIndex(x => x["data"].name === file.name);
          if (i !== -1) {
            this.files.splice(i, 1);
          }
        }
      }
    }
  }
  isFileTypeAllowed(file): boolean {
    let fileExtension = file.name.split('.');
    fileExtension = fileExtension[fileExtension.length - 1];
    if ((file.type) || -1 !== this.accept.indexOf(fileExtension)) {
      return true;
    } else {
      return false;
    }
  }
  addFileObject(file) {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      const fileAttachment: FileAttachment = new FileAttachment();
      let fileContent: any = reader.result;
      fileContent = fileContent.split('base64,')[1];
      fileAttachment.content = fileContent;
      fileAttachment.name = file.name;
      fileAttachment.type = file.type !== '' ? file.type : `application/${file.name.split('.').pop()}`
      fileAttachment.size = file.size;
      if (this.documentName != null && this.documentName != undefined) {
        fileAttachment.documentName = this.documentName;
      }
      fileAttachment.metadata = this.inputMetadata.concat(this.metadata);
      this.inputFiles.push(fileAttachment);
      // console.log( this.inputFiles)
      this.onAddDoc();
      this.getuploadedFile.emit(this.inputFiles);
    };
    reader.readAsDataURL(file);
  }

  uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);
    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true
    });
    file.inProgress = true;
    file.sub = this._http.request(req).pipe(map(event => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          file.progress = Math.round(event.loaded * 100 / event.total);
          break;
        case HttpEventType.Response:
          return event;
      }
    }),
      tap(message => { }), last(), catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe((event: any) => { if (typeof (event) === 'object') { this.complete.emit(event.body); } }
    );
  }

  uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';
    this.files.forEach(file => { this.uploadFile(file); });
  }

  cancelFile(file) {
    file.sub.unsubscribe();
    // this.removeFileFromArray(file);
    const index = this.files.indexOf(file);
    if (index > -1) { this.files.splice(index, 1); }
    const i = this.inputFiles.findIndex(x => x.name === file.data.name);
    if (i > -1) { this.inputFiles.splice(i, 1); }
    this.removeFile.emit(true);
  }
  onInputFilesUpdated(event) {
    this.inputFilesUpdated.emit(this.inputFiles);
  }
  // NgFor to unique Id Everytime 
  trackByFn(item) {
    return item.id;
  }
}
