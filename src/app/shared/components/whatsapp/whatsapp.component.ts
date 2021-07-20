import { Input, SimpleChanges } from '@angular/core';
import { Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { WhatsappService } from 'src/app/shared/services/shared/whatsapp.service';
const WAAPI = 'e0f8742e2f7644f6c4ec5dfca464a14d';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})

export class WhatsappComponent implements OnInit, OnChanges, OnDestroy {
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public allWhatsappUsers: string[] = [];
  public userChatData: string[] = [];
  public currentUserData: string[] = [];
  public flag: boolean = false;
  public SelectOption: string;
  public Message: string;
  public responseMessage: string;
  public URL: string;
  public searchtext: string = '';
  public SelectFile: string = '';
  public searchnumber: string = '';
  public FileFlag: boolean;
  public FinalFileURL: any;
  public FinalFileName: any;
  public DocName: any;
  public SelectedType: any;
  public onChangeFlag: boolean;
  public NodataFound: boolean;
  public CardHeight: string;
  public SelectedURL: string;
  public Delflag: boolean;
  public WhatsAapNo: string;
  public SelectedFile: FileAttachment[] = [];
  public filesModel: FileAttachment[] = [];
  public selectorArray: any;
  public fileTypes = [
    { key: '.jpeg', value: 'Image' },
    { key: '.png', value: 'Image' },
    { key: '.PDF', value: 'File' },
    { key: '.DOCX', value: 'File' },
    { key: '.XLSX', value: 'File' }
    // { key: '.MP4', value: 'Video' }
  ]
  public inputstring = 'https://signupforservices.com/whatsapp/optin/?bId=afc9a3f2-d255-4603-806d-8277eed6a439&bName=TRURealty&s=URL&lang=en_US';

  @Input() UserDetails: any;
  @ViewChild('addnewUserModel', { static: false }) public addnewUserModel: ModalDirective;
  @ViewChild('addAttachmentModel', { static: false }) public addAttachmentModel: ModalDirective;

  private _unsubscribeAll: Array<Subscription> = [];
  public PrimaryNo: string;
  public AlternateNo: string;

  // https://truimages.blob.core.windows.net/productionimages/Document/Email/793dcb93-77e5-46e5-83e7-205618c738df0020-002_P_Master_Layout_-_Plotting.pdf
  // https://truimages.blob.core.windows.net/productionimages/Document/Email/b45c5f0f-50c4-4a00-9035-256100f94790200720_0020_Bavdhan_Landscape.pdf	
  // https://truimages.blob.core.windows.net/productionimages/Document/Email/d9e23740-dc92-4c4b-a75d-7a1742749e68KEKARAV_E-Brochure_For_Mobile.pdf

  constructor(private whatsappService: WhatsappService) {
    const mySub = interval(8000).subscribe((func => {
      if (this.UserDetails && this.UserDetails.MobileNoforWA && !this.WhatsAapNo)
        this.WhatsAapNo = (this.UserDetails.CountryCode && this.UserDetails.CountryCode !== null ? this.UserDetails.CountryCode : '91') + this.UserDetails.MobileNoforWA;
      this.getDetails(this.WhatsAapNo, 'GetMsgbyNum')
    }))
    this._unsubscribeAll.push(mySub);
  }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
  }
  openFile(url) {
    window.open(url)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.UserDetails && this.UserDetails) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.PrimaryNo = (this.UserDetails.CountryCode && this.UserDetails.CountryCode !== null ? this.UserDetails.CountryCode : '') + (this.UserDetails.MobileNoforWA && this.UserDetails.PresalesAgentAssigned !== this.loggedInuserDetails.EntityId ? this.UserDetails.MobileNoforWA.replace(/\d(?=\d{4})/g, "X") : this.UserDetails.MobileNoforWA);
      this.AlternateNo = (this.UserDetails.AlternateNo && this.UserDetails.AlternateNo !== "" && this.UserDetails.PresalesAgentAssigned !== this.loggedInuserDetails.EntityId ? this.UserDetails.AlternateNo.replace(/\d(?=\d{4})/g, "X") : this.UserDetails.AlternateNo);
      this.selectorArray = [];
      this.selectorArray.push({ 'key': this.PrimaryNo, 'value': this.PrimaryNo });
      if (this.AlternateNo) {
        var tempal = this.AlternateNo.split(",");
        tempal.forEach(n => {
          let alt = {};
          alt['key'] = alt['value'] = (n && n.length === 10) ? '91' + n : n;
          this.selectorArray.push(alt);
        });
      }
      this.getDetails(this.PrimaryNo, 'GetMsgbyNum');
      this.onChangeFlag = true
    }
  }
  // Get all whatsapp user list & select by ID
  getDetails = (number, Input) => {
    let Temp = [];
    Temp['Input'] = Input;
    Temp['Number'] = number;
    this.currentUserData = Array.of(number);
    const getChatandList = this.whatsappService.getWAUsers(Temp)
      .subscribe((response) => {
        if (response && response['data'].length > 0) {
          this.WhatsAapNo = number;
          this.userChatData = response['data'];
          this.flag = true;
          this.NodataFound = false;
        } else {
          this.NodataFound = true;
        }
        this.Delflag = false;
        this.CardHeight = this.NodataFound === true ? 'nodata' : 'dataf';
      });
    this._unsubscribeAll.push(getChatandList);
  }

  enterClick = (event) => {
    if (event.keyCode == 13) {
      this.addnewUserModel.hide();
      this.sendMsg(this.Message);
    }
  }

  selectFileOption = (item) => {
    this.SelectedType = item;
    this.FileFlag = true;
  }

  onSendMessage = (input) => {
    input === 'Primaryno' ? (this.WhatsAapNo = this.UserDetails.MobileNoforWA) : (this.WhatsAapNo = ((this.AlternateNo && this.AlternateNo.length === 10) ? '91' + this.AlternateNo : this.AlternateNo));
    let Temp = 'To get notifications about Project Kekarav on WHATS APP' + '\n' +
      'Click here https://bit.ly/36afXwo' + '\n' +
      'Thanks & Regards' + '\n' +
      'TRU Realty'
    const sendmessageSub = this.whatsappService.sendMessage(this.loggedInuserDetails, this.WhatsAapNo, Temp)
      .subscribe((response) => {
        if (response) {
          this.responseMessage = 'Message Sent'
        } else {
          this.responseMessage = 'Message Not Sent'
        }
      });
    this._unsubscribeAll.push(sendmessageSub)
  }

  uploaddoc = () => {
    this.del();
    let WhatsAppTemp = [];
    if (this.SelectedType) {
      switch (this.SelectedType) {
        case '.jpeg': WhatsAppTemp['Type'] = 'image'; break;
        case '.png': WhatsAppTemp['Type'] = 'image'; break;
        case '.PDF': WhatsAppTemp['Type'] = 'file'; break;
        case '.DOCX': WhatsAppTemp['Type'] = 'file'; break;
        case '.XLSX': WhatsAppTemp['Type'] = 'file'; break;
        case '.MP4': WhatsAppTemp['Type'] = 'video'; break;
      }
    } else {
      WhatsAppTemp['Type'] = 'location';
    }
    let WhatsappData = [], uploadModel = [];
    uploadModel['fileType'] = this.SelectedType;
    WhatsappData['Type'] = WhatsAppTemp['Type'];
    WhatsappData['url2'] = null;
    WhatsappData['filename'] = this.filesModel[0].name;
    WhatsappData['message'] = this.Message;
    WhatsappData['destination'] = '91' + this.UserDetails.MobileNo;
    WhatsappData['source'] = '917559312098';
    WhatsappData['app'] = 'TRURealty';
    WhatsappData['apikey'] = WAAPI;
    this.addAttachmentModel.hide();

    const uploaddocsub = this.whatsappService.uploadDocument(this.loggedInuserDetails, 'Whatsapp', this.filesModel, uploadModel, WhatsappData)
      .subscribe((response) => {
        if (response && response['data']) {
          let Temp = [];
          Temp = response['data'];
          this.saveChat(Temp['fileUrl'], Temp['fileName']);
          // fileName: "profile.png"
          // null
          // fileUrl: "https://truimages.blob.core.windows.net/executionfiles/UploadedDoc/Whatsapp/3d60fe8d-b2d5-4540-9c52-55891ae4def3profile.png"
          // id: "10704286"
          // uploadedBy: "Sales Kekarav Test"
          // userType: "Whatsapp"
          setTimeout(() => {
            this.filesModel = []; this.SelectFile = '';
          }, 1000);
        }
      });
    this._unsubscribeAll.push(uploaddocsub)
  }

  // uploadFileAndGetURL = (filesModel) => {
  //   let temp = [], WhatsAppTemp = [];
  //   temp['FileType'] = 'WhatsappDoc';
  //   if (this.SelectedType) {
  //     switch (this.SelectedType) {
  //       case '.jpeg': WhatsAppTemp['Type'] = 'image'; break;
  //       case '.png': WhatsAppTemp['Type'] = 'image'; break;
  //       case '.PDF': WhatsAppTemp['Type'] = 'file'; break;
  //       case '.DOCX': WhatsAppTemp['Type'] = 'file'; break;
  //       case '.XLSX': WhatsAppTemp['Type'] = 'file'; break;
  //       case '.MP4': WhatsAppTemp['Type'] = 'video'; break;
  //     }
  //   } else {
  //     WhatsAppTemp['Type'] = 'location';
  //   }
  //   let MobileNo = this.currentUserData[0]['Number'];
  //   const headers = new HttpHeaders()
  //     .append('Content-Type', 'application/x-www-form-urlencoded')
  //     .append('apikey', WAAPI);


  //   // const body = new HttpParams({ fromObject: testt as any });
  //   // const tempurl = 'http://enterprise.smsgupshup.com/doc/GatewayAPIDoc.pdf';
  //   // let myParams = {
  //   //   type: "file",
  //   //   filename: "Sample file"
  //   // };

  //   // let u = new URLSearchParams(myParams).toString();

  //   // console.log(u);

  //   // let mess = new HttpParams({
  //   //   fromObject: {
  //   //     type: "file",
  //   //     url: "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample02.pdf",
  //   //     filename: "Sample file"
  //   //   }
  //   // });

  //   // let MessageBody = {
  //   //   type: WhatsAppTemp['Type'],
  //   //   url: this.FinalFileURL,
  //   //   filename: this.FinalFileName
  //   // }

  //   // let body = new HttpParams({
  //   //   fromObject: {
  //   //     channel: 'whatsapp',
  //   //     source: '917559312098',
  //   //     destination: MobileNo,
  //   //     ['src.name']: 'TRURealty',
  //   //     message: JSON.stringify(MessageBody)
  //   //   }
  //   // } as any);

  //   let MsgBOdy = this.Message !== undefined || this.Message !== '' ? this.Message : '';

  //   //  this.FinalFileURL = 'https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample02.pdf';
  //   // this.FinalFileURL = 'https://truimages.blob.core.windows.net/executionfiles/UploadedDoc/Whatsapp/0470d2e7-46ff-4b32-811f-d394f0ac09c6err.PNG';
  //   this.FinalFileURL = filesModel;

  //   const URLBOdy = `channel=whatsapp&source=917559312098&destination=` + MobileNo + `&message=%7B%22type%22:%22file%22,%22url%22:%22` + this.FinalFileURL + `%22,%22caption%22:%22` + MsgBOdy + `%22,%22filename%22:%22` + this.DocName + `%22%7D&src.name=TRURealty`;
  //   const url = `https://api.gupshup.io/sm/api/v1/msg?apikey=${WAAPI}`;
  //   this.http.post<any[]>(url, URLBOdy, { headers: headers }).subscribe(
  //     (data) => {
  //       console.log(data);
  //       this.saveChat(filesModel, this.DocName)

  //     },
  //     (err: HttpErrorResponse) => {
  //       if (err.error instanceof Error) {
  //         console.log('Client-side error occured.');
  //       } else {
  //         console.log('Server-side error occured.');
  //       }
  //     });
  //   this.addAttachmentModel.hide();
  // }


  saveChat = (FinalURL, filename) => {
    let WhatsAppTemp = [];
    WhatsAppTemp['message'] = this.Message;
    WhatsAppTemp['destination'] = this.currentUserData[0];
    WhatsAppTemp['source'] = '917559312098';
    WhatsAppTemp['app'] = 'TRURealty';
    WhatsAppTemp['apikey'] = WAAPI;
    WhatsAppTemp['Type'] = 'file';
    this.FinalFileURL = FinalURL;
    const SendMsgSub = this.whatsappService.SaveMessageWithAttachment(WhatsAppTemp, this.FinalFileURL, filename)
      .subscribe((response) => {
        if (response === 200) {
          this.getDetails(this.currentUserData[0], 'GetMsgbyNum');
          this.URL = this.DocName = '';
          this.addAttachmentModel.hide();
          this.SelectedFile = this.filesModel = [];
        }
      });
    this._unsubscribeAll.push(SendMsgSub);
  }

  del() {
    this.Delflag = true;
  }

  receiveimage = ($event) => {
    this.filesModel = $event;
  }

  sendMsg = (message) => {
    let destination = this.currentUserData[0];
    const SendMsgSub = this.whatsappService.SaveWAmessage(null, message, '917559312098', destination, 'TRURealty', WAAPI)
      .subscribe((response) => {
        if (response === 200) {
          this.getDetails(this.currentUserData[0], 'GetMsgbyNum');
        }
      });
    this._unsubscribeAll.push(SendMsgSub);
    this.Message = '';
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy = () => {
    for (const item of this._unsubscribeAll) {
      item.unsubscribe();
    }
  }
}


