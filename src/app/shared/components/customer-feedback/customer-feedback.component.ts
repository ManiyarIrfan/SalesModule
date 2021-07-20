import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FeedbackService } from '../../services/shared/feedback.service';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import * as $ from 'jquery'

@Component({
  selector: 'app-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.scss']
})
export class CustomerFeedbackComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: any = [];
  public FeedbackDetails: any[] = [];
  public GetAmenities: any[] = [];
  public PresentationDetails: string[] = [];
  public FinalData: any[] = [];
  public SectorHeader: string[] = [];
  public AllSectorData: any[] = [];
  public MainHeader: string[];
  public GetArena: any[] = [];
  public GetArenaList: any[] = [];
  public SelectedImg: string = '';
  public disablebtn: boolean;
  public SelectedSectorTitle: string = '';
  public FeedBackModel: any = {}
  // public Data = [
  //   { img: 'https://truimages.blob.core.windows.net/projectstatus/Amenities/CustomerProject/6374ee19-9422-4c9b-81f7-7e2c094690e01.PNG', Amenities: 'Sector III - Biodiversity Park', coords: '238,407,290,362,334,347,369,371,360,415,276,414', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/bbc7572d-6ee7-4900-8235-7b603bad202aSector_III_Leisure_retreat.JPG', Amenities: 'Sector III - Leisure retreat', coords: '209,374,224,293,253,296,264,246,285,242,311,308,275,323', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/6e777ba0-cec8-430a-a3bd-3766aea53d0eSector_III_natural_trails.JPG', Amenities: 'Sector III - Nature trail,Miyawaki Garden', coords: '233,88,243,130,256,127,257,106,268,121,320,121,308,83,280,75', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/projectstatus/Amenities/CustomerProject/fa66787a-7a2c-444f-8a16-3f1bed26da2b6.PNG', Amenities: 'H.E.M.R.L Green zone', coords: '546,178,542,169,569,63,599,100,572,181,629,191,671,169,671,141,716,147,715,167,772,182,850,210,861,188,887,170,910,188,935,179,946,185,970,176,998,192,970,247,744,245', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/projectstatus/Amenities/CustomerProject/4d65c0fb-ccee-4108-8870-7283807380221.PNG', Amenities: 'Sector II - Multi-function area & Entrance plaza', coords: '872,358,913,330,952,338,945,373,883,371', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/44200373-a8c3-46ef-b25c-d5bc9087cdb7Sector_I_Sports_arena.JPG', Amenities: 'Sector I - Sports arena & active recreation', coords: '1002,471,1010,459,1024,459,1034,433,1057,488,1047,501', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/projectstatus/Amenities/CustomerProject/04991411-3c11-4107-a837-224fcd642f211.PNG', Amenities: 'Sector I - Public Square', coords: '1202,628,1153,599,1151,591,1177,534,1188,531,1228,545', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/9c305eaa-e7ba-44b8-b4d4-5f2cdd926381Sector_II- multifunction_area.JPG', Amenities: 'Sector I - Multi-function area & life style center', coords: '1156,511,1171,470,1073,450,1066,459,1071,482', shape: "poly" },
  //   { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/a5d9e212-bfa3-4dd0-8140-d2d4adac9c04Kekarav_Sector_III.JPG', Amenities: 'SECTOR III', coords: '3,43,493,553', shape: 'rect' },
  //   { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/8fe4c171-91db-4a87-ae8f-1526ba77a2e3Kekarav_Sector_II.JPG', Amenities: 'SECTOR II', coords: '700,233,961,502', shape: 'rect' },
  //   { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/841611b8-bebd-49e3-b56f-3f6fa56b4215Kekarav_Sector_I.JPG', Amenities: 'SECTOR I', coords: '985,300,1294,664', shape: 'rect' },
  // ];


  public MappingData = [
    { img: '', Amenities: 'Plot No : 71-86 ,Facing : North-East ,Height from base point : 25mtr', coords: '1053,622,1072,632,1090,644,1108,653,1252,739,1352,800,1341,835,1305,839,1251,780,1203,749,1144,713,1087,681,1041,650', shape: 'poly' },
    { img: '', Amenities: 'Plot No :69-70,Facing :South -West,Height from base point:16Mtr', coords: '1131,614,1152,622,1181,642,1179,650,1203,661,1241,682,1296,709,1286,728,1280,735,1265,731,1220,705,1197,688,1162,669,1142,656,1112,640,1083,622,1060,609,1068,579,1103,592,1124,596,1136,601', shape: 'poly' },
    { img: '', Amenities: 'Plot No : 53-58,Facing:North-East,Height from base point:12 Mtr', coords: '1193,629,1211,640,1229,647,1248,653,1290,666,1307,674,1311,681,1295,707,1258,691,1222,673,1204,663,1180,648', shape: 'poly' },
    { img: '', Amenities: 'Plot No :41-44,Facing:North-East,Height from base point:11 Mtr', coords: '1082,551,1118,557,1139,562,1162,565,1160,593,1147,596,1136,599,1111,593,1072,578', shape: 'poly' },
    { img: '', Amenities: 'Plot No:38-40,Facing:South-West,Height from base point: 2Mtr', coords: '1089,539,1121,543,1146,549,1157,541,1157,530,1147,512,1116,508,1095,502', shape: 'poly' },
    { img: '', Amenities: 'Plot No:36-37,Facing:North-East,Height from base point:2Mtr', coords: '1097,504,1123,508,1149,513,1133,471,1100,466', shape: 'poly' },
    { img: '', Amenities: 'Plot No:25-35,Facing:South-West,Height from base point:2Mtr', coords: '1272,554,1323,565,1383,577,1411,580,1407,611,1373,604,1310,590,1256,580,1199,570,1186,559,1177,534', shape: 'poly' },
    { img: '', Amenities: 'Plot No:13-24,Facing:North-East,Height from base point:2Mtr', coords: '1180,507,1238,520,1305,531,1386,547,1414,555,1411,580,1365,572,1292,557,1225,544,1180,536,1173,516', shape: 'poly' },
    { img: '', Amenities: 'Plot No:1-12,Facing:South-West,Height from base point: 2Mtr', coords: '1255,476,1324,491,1399,505,1394,533,1357,526,1285,512,1229,500,1162,487,1147,455', shape: 'poly' },
    { img: '', Amenities: 'Plot No:45-48,Facing:North-East,Height from base point:7Mtr', coords: '1313,631,1359,644,1399,653,1391,681,1331,663,1305,652', shape: 'poly' },
    { img: '', Amenities: 'Plot No:49-52,Facing:South-West,Height from base point: 11Mtr', coords: '1321,607,1367,618,1409,626,1399,654,1380,649,1359,642,1333,637,1315,631,1318,616,1320,611', shape: 'poly' },
    { img: '', Amenities: 'Plot No:93-98,Facing:North-East,Height from base point:20Mtr', coords: '837,522,879,537,916,547,970,568,955,605,871,561,832,538', shape: 'poly' },
    // { img: '', Amenities: 'Future Development', coords: '151,569,305,591,299,653,403,647,470,660,459,595,514,589,596,580,589,537,548,528,434,486,420,498,332,546,269,536,295,505,329,484,376,464,384,454,414,484,424,469,403,417,379,350,368,283,339,278,344,349,324,350,353,423,312,443,234,504,252,406,283,406,299,354,325,337,337,327,328,271,349,270,368,258,307,250,281,225,266,179,217,193,126,187,58,236,-1,250,42,385,63,462,80,632,86,653,125,643,133,604', shape: 'poly' },
    // { img: '', Amenities: 'Base Point', coords: '962,377,1019,382,1087,386,1077,441,1046,438,1017,429,978,420,938,403,933,384,941,377', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/bbc7572d-6ee7-4900-8235-7b603bad202aSector_III_Leisure_retreat.JPG', Amenities: 'Sector III - Leisure Retreat', coords: '256,408,285,414,300,357,325,351,355,428,308,446,236,503', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/projectstatus/Amenities/CustomerProject/6374ee19-9422-4c9b-81f7-7e2c094690e01.PNG', Amenities: 'Sector III - Biodiversity Park', coords: '271,537,329,488,376,466,414,494,414,547,359,544,308,545', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/6e777ba0-cec8-430a-a3bd-3766aea53d0eSector_III_natural_trails.JPG', Amenities: 'Sector III - Nature Trail & Miyawaki Garden', coords: '77,233,253,278,249,257,279,249,278,225,290,222,294,200,302,211,360,214,357,199,348,171,297,166,220,194,124,190', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/9156369d-01fa-4562-971f-e1836b7bedcfhemrl.jpg', Amenities: 'H.E.M.R.L. Green Zone', coords: '718,315,764,330,844,358,922,353,985,358,1023,356,1096,361,1125,294,1097,278,1073,290,1057,282,1030,291,1005,271,975,290,963,318,870,284,824,273,808,271,811,246,758,235,758,271,712,293,649,285,674,191,645,149,614,271,622,282', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/projectstatus/Amenities/CustomerProject/04991411-3c11-4107-a837-224fcd642f211.PNG', Amenities: 'Sector I - Public Square', coords: '1330,674,1313,721,1300,741,1355,787,1368,750,1380,712,1387,692,1355,681', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/44200373-a8c3-46ef-b25c-d5bc9087cdb7Sector_I_Sports_arena.JPG', Amenities: 'Sector I - Sports Arena & Active Recreation', coords: '1158,593,1162,566,1170,573,1185,598,1194,629,1183,641,1162,629,1147,618,1130,613,1135,600', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Amenities/CustomerProject/ea9ec775-109c-4cc1-8a4b-9820a99b1fa5multi_functional_area.JPG', Amenities: 'Sector I - Multi-Functional Area & Lifestyle Centre', coords: '1199,594,1210,616,1225,631,1268,643,1302,656,1313,632,1320,611,1297,600,1222,585', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/9c305eaa-e7ba-44b8-b4d4-5f2cdd926381Sector_II-%20multifunction_area.JPG', Amenities: 'Sector II - Multi-Functional Area & Entrance plaza', coords: '985,483,1025,451,1072,459,1067,497,1019,497,992,491', shape: 'poly' },
    // { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/53697d9d-9eb1-43f0-90e3-a0fb78ccb2f4walking.png', Amenities: 'Exercise Trail', coords: '542,291,530,328,556,345,594,347,602,300,561,287', shape: 'poly' },
    { img: '', Amenities: 'Plot No:87-92,Facing:South-Wast,Height from base point:15Mtr', coords: '847,480,847,505,859,513,917,534,973,554,984,531', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/6031afd4-375c-462f-b782-5933b5b6be47solar.PNG', Amenities: 'Solar Farm', coords: '831,540,819,570,945,635,956,606', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/ffbd327c-b993-4285-94b4-84e9ff4ea7b8123.jpg', Amenities: 'Sector I -  Miyawaki Dense forest', coords: '1400,504,1396,530,1404,538,1403,547,1414,550,1405,609,1415,611,1436,559,1407,511,1428,545,1416,528', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/8fa3c1f5-86ca-4113-93ee-1ea064a8912d444.png', Amenities: 'Base Point', coords: '831,381,940,377,939,355,797,362', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/0e6f0957-e4b6-4e5b-ba3f-282a46fafcc7entrance.PNG', Amenities: 'Sector II - Entrance Plaza', coords: '844,382,938,378,930,396,924,418', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/841611b8-bebd-49e3-b56f-3f6fa56b4215Kekarav_Sector_I.JPG', Amenities: 'SECTOR I', coords: '985,300,1294,664', shape: 'rect' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/8fe4c171-91db-4a87-ae8f-1526ba77a2e3Kekarav_Sector_II.JPG', Amenities: 'SECTOR II', coords: '700,233,961,502', shape: 'rect' },
    // { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/a5d9e212-bfa3-4dd0-8140-d2d4adac9c04Kekarav_Sector_III.JPG', Amenities: 'SECTOR III', coords: '3,43,493,553', shape: 'rect' },
    { img: '', Amenities: 'Future Development', coords: '307,594,306,654,400,649,468,661,461,597', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '147,571,125,641,85,661,73,561', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '172,552,168,471,235,484,237,505,309,444,352,428,361,453,321,473,273,513,212,559', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '150,393,168,456,241,467,254,408,250,408', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '147,371,291,400,298,357,291,334,148,311,143,338', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '59,260,152,291,291,319,287,286,282,252,246,256,257,282', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '83,237,67,322,69,398,76,418,87,453,91,503,95,543,144,550,156,546,152,454,127,371,144,258', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/a5d9e212-bfa3-4dd0-8140-d2d4adac9c04Kekarav_Sector_III.JPG', Amenities: 'Sector III', coords: '284,253,291,267,315,273,331,363,365,446,337,469,275,509,213,557,243,561,337,486,379,470,383,456,351,363,338,279,370,280,367,257,292,220,279,227', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '340,279,348,357,380,434,405,422,378,354,370,280', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/a5d9e212-bfa3-4dd0-8140-d2d4adac9c04Kekarav_Sector_III.JPG', Amenities: 'Sector III', coords: '69,241,2,253,41,324,40,384,65,462,72,558,150,568,171,550,150,550,95,540,87,457,64,380,83,238', shape: 'poly' },
    { img: 'https://truimages.blob.core.windows.net/productionimages/Document/Email/a5d9e212-bfa3-4dd0-8140-d2d4adac9c04Kekarav_Sector_III.JPG', Amenities: 'Sector III', coords: '144,257,129,317,128,375,148,446,155,547,175,558,169,482,240,488,243,476,195,464,169,459,159,427,149,399,156,393,255,409,287,415,291,404,148,377,144,360,148,314,159,314,244,328,298,341,294,325,249,312,198,304,163,297,154,291,159,259', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '286,270,299,355,326,353,315,271,302,269', shape: 'poly' },
    { img: '', Amenities: 'Future Development', coords: '275,537,313,544,410,545,473,545,507,546,587,536,597,574,575,579,575,568,456,581,299,579,243,565', shape: 'poly' }
  ]

  @ViewChild('viewLargeModel', { static: false }) public viewLargeModel: ModalDirective;
  @ViewChild('PlayTeaser', { static: false }) public PlayTeaser: ModalDirective;
  @ViewChild('MapviewLargeModel', { static: false }) public MapviewLargeModel: ModalDirective;

  private FeedbackSubscription: Array<Subscription> = []

  constructor(
    private _snackBar: MatSnackBar,
    private _elRef: ElementRef,
    private _feedbackService: FeedbackService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.GetAllData();
    window.scroll(0, 0);
  }

  // View Image /Amenities Details
  viewImages = (data, action) => {
    switch (action) {
      case 'ImageMap':
        this.SelectedImg = data.img
        this.SelectedSectorTitle = data.Amenities
        if (data.img !== '') {
          this.MapviewLargeModel.show();
        }
        break;
      case 'Slider':
        this.SelectedImg = data.FileURL;
        this.SelectedSectorTitle = data.Arena
        this.viewLargeModel.show();
        break;
      case 'keymap':
        this.SelectedImg = data.FileURL;
        // this.SelectedSectorTitle = data.Arena
        this.viewLargeModel.show();
        break;
    }
  }

  // Zoom map Image
  zoomin() {
    var myImg = $("#map");
    var currWidth = myImg.outerWidth();
    if (currWidth == 2500) return false;
    else {
      myImg.css('width', currWidth + 100) + "px";
    }
  }

  zoomout() {
    var myImg = $("#map")
    var currWidth = myImg.outerWidth();
    if (currWidth == 100) return false;
    else {
      myImg.css('width', currWidth - 100) + "px";
    }
  }

  // Get All Details like dealer order,emp order details
  GetAllData = () => {
    let TempData = [];
    TempData['Input'] = 'DetailsforFeedback';
    const getAminities = this._feedbackService.getAmenities(this.loggedInuserDetails, TempData)
      .subscribe(response => {
        if (response) {
          let test = [];
          this.GetAmenities = response['data'][0];
          this.GetArena = response['data'][1];
          this.GetArenaList = response['data'][2];
          this.GetAmenities.forEach((item) => {
            if (item.Amenities !== null) {
              let TempArena = this.GetArena.filter(x => x.MapId === item.MapId)
              let TempArenaList = this.GetArenaList.filter(x => x.MapId === item.MapId)
              test.push({
                Arena: TempArena,
                TempArenaList: TempArenaList,
                MapId: item.MapId,
                EditParameters: (item.Feedback === null) ? true : false,
                Sector: item.Sector,
                Amenities: item.Amenities,
                ProjectId: item.ProjectId,
                Coords: item.Coords,
                Shape: item.Shape,
                FileURL: item.FileURL,
                Feedback: item.Feedback,
                FeedbackBackUp: item.Feedback,
                Rating: Number(item.Rating),
                RatingBackUp: Number(item.Rating),
              })
            }
          })
          let SectorTitle = [];
          SectorTitle = test && test.reduce((r, a) => {
            r[a.Sector] = [...r[a.Sector] || [], a];
            return r;
          }, {});
          this.FinalData = this.AllSectorData = (SectorTitle)
          this.MainHeader = this.SectorHeader = Object.keys(this.FinalData);
        } else {
          this._snackBar.open('Data Not Found', 'Close', { duration: 3000 });
        }
      });
    this.FeedbackSubscription.push(getAminities);
  }

  // Sort Data sector wise
  SectorSort = (Sector) => {
    let TempData = [];
    if (Sector === 'All') {
      this.FinalData = this.AllSectorData
      this.SectorHeader = Object.keys(this.FinalData);
    } else {
      let SortedData = [];
      SortedData = this.GetAmenities.filter(x => x.Sector === Sector)
      SortedData.forEach((item) => {
        let TempArena = this.GetArena.filter(x => x.MapId === item.MapId)
        let TempArenaList = this.GetArenaList.filter(x => x.MapId === item.MapId)
        TempData.push({
          Arena: TempArena,
          TempArenaList: TempArenaList,
          MapId: item.MapId,
          EditParameters: (item.Feedback === null) ? true : false,
          Sector: item.Sector,
          Amenities: item.Amenities,
          Coords: item.Coords,
          Shape: item.Shape,
          FileURL: item.FileURL,
          Feedback: item.Feedback,
          ProjectId: item.ProjectId,
          FeedbackBackUp: item.Feedback,
          Rating: Number(item.Rating),
          RatingBackUp: Number(item.Rating),
        })
      })
      let SortedSectorData = []
      SortedSectorData = TempData && TempData.reduce((r, a) => {
        r[a.Sector] = [...r[a.Sector] || [], a];
        return r;
      }, {});
      this.FinalData = (SortedSectorData)
      this.SectorHeader = Object.keys(this.FinalData);
    }
  }

  EditDetails = (data) => {
    data.HideShowBtn = !data.HideShowBtn
    data.EditParameters = !data.EditParameters
    return data;
  }

  // Enable Submit/cancel btn
  ViewSubmit = (data) => {
    if (data.Feedback !== null) {
      data.EditParameters = true;
      data.disablebtn = false;
    } else {
      data.EditParameters = false;
      data.disablebtn = true;
    }
    return data;
  }

  // Cancel Entered Data and diasble btn
  CancelEditedFeedback = (data) => {
    if (data.Feedback !== null) {
      if (data.Feedback !== data.FeedbackBackUp) {
        data.Feedback = data.FeedbackBackUp ? data.FeedbackBackUp : '';
        data.disablebtn = true;
        data.EditParameters = false;
      }
    } else {
      data.EditParameters = true;
    }
    if (data.Rating !== null) {
      if (data.Rating !== data.RatingBackUp) {
        data.Rating = (data.RatingBackUp > 0) ? Number(data.RatingBackUp) : '';
        data.disablebtn = true;
        data.EditParameters = false;
      }
    } else {
      data.EditParameters = true;
    }
    return data;
  }

  // Insert Feedback Aminities Wise
  InsertFeedback = (Feedbackdata) => {
    this.disablebtn = true;
    let CustomerDetails = [];
    // let data = [];
    CustomerDetails['MapId'] = Feedbackdata.MapId ? Feedbackdata.MapId : null;
    CustomerDetails['Feedback'] = Feedbackdata.Feedback ? Feedbackdata.Feedback : null;
    CustomerDetails['Rating'] = Feedbackdata.Rating ? Feedbackdata.Rating : null;
    CustomerDetails['ProjectId'] = Feedbackdata.ProjectId ? Feedbackdata.ProjectId : null;
    CustomerDetails['Input'] = 'Insert';
    // this.SectorHeader.forEach(element => {
    //   this.FinalData[element].forEach(items => {
    //     if (items.Rating !== '' && items.Feedback !== '') {
    //       data.push({
    //         MapId: (items.MapId ? items.MapId : null),
    //         Rating: (items.Rating ? items.Rating : null),
    //         Feedback: (items.Feedback ? items.Feedback : null)
    //       })
    //     }
    //   });
    // }); 
    const InsertFeedSub = this._feedbackService.InsertCustomerFeedback(this.loggedInuserDetails, CustomerDetails)
      .subscribe((response) => {
        if (response && response['data']) {
          this._snackBar.open('Thank You for your Feedback', 'Close', { duration: 3000 });
        } else {
          this._snackBar.open('Feedback Insertion Failed', 'Close', { duration: 3000 });
          this.disablebtn = false;
        }
        this.GetAllData();
      });
    this.FeedbackSubscription.push(InsertFeedSub);
    Feedbackdata.disablebtn = true;
    return Feedbackdata;
  }

  viewPresentation = (Action) => {
    switch (Action) {
      case 'video':
        this.PresentationDetails['Video'] = 'https://trushare.blob.core.windows.net/production/Kekaraav Teaser.mp4';
        const player = this._elRef.nativeElement.querySelector('video');
        // player.load();
        setTimeout(() => {
          this.PlayTeaser.show();
        }, 300); break;
      case 'PPT':
        this.PresentationDetails['PPT'] = 'https://trushare.blob.core.windows.net/production/KekaravFile.pdf'
        window.open(this.PresentationDetails['PPT']);
        break;
      case 'Feedback':
        window.scroll(0, 100);
        setTimeout(() => {
          this.PlayTeaser.show();
        }, 300);
        break;
    }
    this.PresentationDetails['Action'] = Action;
  }

  // on sumit deedback
  OnFeedbackSubmit = (FeedbackForm) => {
    this.FeedBackModel.Disable = true;
    this.FeedBackModel['feedBackName'] = 'Kekarav Login Popup Feedback';
    const FeedbackSub = this._feedbackService.InsertFeedback(this.loggedInuserDetails, this.FeedBackModel)
      .subscribe((response) => {
        if (response && response["successful"]) {
          this.PlayTeaser.hide();
          this._snackBar.open('Thank You for your Feedback', 'Close', { duration: 3000 });
        } else {
          this._snackBar.open('Feedback Insertion Failed', 'Close', { duration: 3000 });
        }
        this.FeedBackModel = {};
        this.FeedBackModel.Details = '';
        this.FeedBackModel.Disable = false;
        FeedbackForm.form.markAsPristine();
        FeedbackForm.form.markAsUntouched();
      });
    this.FeedbackSubscription.push(FeedbackSub)
  }

  // NgFor to unique Id Everytime 
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    for (let item of this.FeedbackSubscription) {
      item.unsubscribe();
    }
  }
}

