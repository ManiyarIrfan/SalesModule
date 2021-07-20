import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import { FileAttachment } from '../../components/file-upload/file-attachment.model';
@Injectable({
  providedIn: 'root'
})
export class OrderPdfService {

  constructor() { }
  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  download(orderDetails, companyName, reraRegistrationNo, Input) {
    let promise = new Promise((resolve) => {
      // var imgData = 'https://truimages.blob.core.windows.net/productionimages/Document/Email/ec3b7127-42a7-463e-8619-970d0af6d0f7kekarav_BookingForm.PNG';
      var imgData = orderDetails.BookingHeadImage;
      this.toDataURL(imgData, function (dataUrl) {
        var doc = new jsPDF();
        doc.addImage(dataUrl, 'png', 5, 5, 200, 50, 'Logo');
        doc.setFontStyle('Roboto');
        // doc.rect(5, 5, 200, 288);
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text(10, 60, `${companyName ? companyName : ''}`);
        doc.setFontSize(11);
        doc.text(10, 67, ` ${reraRegistrationNo ? `(RERA# :` + reraRegistrationNo + ')' : ''} `);
        doc.setFontStyle("normal");
        // doc.rect(185, 10, 18, 11);      
        // doc.setFillColor(255, 255, 200);
        // doc.rect(5.5, 26, 199, 11, 'F');
        // doc.text(`Booking Letter / Form`, 105, 80, null, null, `center`);
        // doc.setFontSize(13);
        doc.text(`${orderDetails.OrderId ? `Order Id : ` + orderDetails.OrderId : ''}`, 160, 60, null, null, `left`);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        // doc.setFillColor(255, 255, 200);
        // doc.rect(5.5, 71, 198, 8, 'F');
        doc.roundedRect(5.5, 71, 200, 25, 2, 2, 'S');
        doc.text('Project Details', 100, 77, null, null, 'center');
        doc.line(5.5, 79, 205.5, 79);
        doc.setFontSize(11);
        doc.text(`Project Name : ` + `${orderDetails.ProjectName ? orderDetails.ProjectName : ''}`, 10, 85);
        doc.text(`Building / Sector No : ` + `${orderDetails.BuildingType ? orderDetails.BuildingType : ''}`, 90, 85, null, null, 'left');
        // doc.text(`Bhk : ` + `${orderDetails.BHK ? orderDetails.BHK : ''}`, 165, 58); 165, 58
        doc.text(`Layout Type : ` + `${orderDetails.LayoutType ? orderDetails.LayoutType : ''}`, 160, 85); //10, 63
        doc.line(5.5, 87, 205.5, 87);
        doc.text(`Plot Number : ` + `${orderDetails.FlatNo ? orderDetails.FlatNo : ''}`, 10, 92, null, null, 'left');//165, 63
        doc.text(`Phase : ` + `${orderDetails.FlatView ? orderDetails.FlatView : ''}`, 160, 92); //90, 63
        doc.text(`Area : ` + `${orderDetails.CarpetArea ? orderDetails.CarpetArea : ''}`, 90, 92);

        // doc.text(`Attached Terrace : ` + `${orderDetails.AttachedTerrace}`, 90, 95, null, null, 'left');
        // doc.text(`Rera Area : ` + `${orderDetails.ReraArea}`, 165, 95);
        // doc.text(`Enclosed Balcony : ` + `${orderDetails.EnclosedBalcony}`, 10, 100);
        // doc.text(`Parking Alloted : ` + `${orderDetails.ParkingSlot ? orderDetails.ParkingSlot : ''}`, 90, 95, null, null, 'left');
        // doc.text(`Rate : ` + `${orderDetails.Rate}`, 165, 100);
        doc.roundedRect(5.5, 110, 200, 36, 2, 2, 'S');
        doc.setFontSize(12);
        // doc.setFillColor(255, 255, 200);
        // doc.rect(5.5, 109, 198, 8, 'F');
        doc.text('Customer Details', 100, 115, null, null, 'center');
        doc.line(5.5, 117, 205.5, 117);
        doc.setFontSize(11);
        doc.text(`Customer Name : ` + `${orderDetails.CustomerName ? orderDetails.CustomerName : ''}`, 10, 123);
        doc.text(`Email : ` + `${orderDetails.Email ? orderDetails.Email : ''}`, 90, 123, null, null, 'left');
        // doc.text(``, 165, 125);
        doc.line(5.5, 125, 205.5, 125);

        doc.text(`Mobile Number : ` + `${orderDetails.MobileNo ? orderDetails.MobileNo : ''}`, 10, 130);
        doc.text(`Adhar No. : ` + `${orderDetails.AadharCard ? orderDetails.AadharCard : ''}`, 90, 130, null, null, 'left');
        doc.text(`PAN No.1 : ` + `${orderDetails.PANNo1 ? orderDetails.PANNo1 : ''}`, 155, 130);
        doc.line(5.5, 132, 205.5, 132);

        doc.text(`PAN No.2 : ` + `${orderDetails.PANNo2 ? orderDetails.PANNo2 : ''}`, 10, 136);
        doc.text(`PAN No.3 : ` + `${orderDetails.PANNo3 ? orderDetails.PANNo3 : ''}`, 90, 136, null, null, 'left');
        doc.text(``, 165, 136);
        doc.line(5.5, 138, 205.5, 138);

        doc.text(`Joint Name 1 : ` + `${orderDetails.JointName1 ? orderDetails.JointName1 : ''}`, 10, 142);
        doc.text(`Joint Name 2 : ` + `${orderDetails.JointName2 ? orderDetails.JointName2 : ''}`, 90, 142, null, null, 'left');


        doc.roundedRect(5.5, 153, 200, 73, 2, 2, 'S');
        doc.setFontSize(12);
        // doc.setFillColor(255, 255, 200);
        // doc.rect(5.5, 147, 198, 8, 'F');
        doc.text('Financial Details', 100, 158, null, null, 'center');
        doc.line(5.5, 161, 205.5, 161);
        doc.setFontSize(11);

        //-----table format in PDF-----//
        doc.line(160, 161, 160, 226); // vertical line


        doc.text(`PARTICULARS`, 65, 167);
        doc.text(`Amount (Rs.)`, 170, 167);
        doc.line(5.5, 169, 205.5, 169);

        doc.text(`Basic Value`, 10, 174);
        doc.text(`${orderDetails.AgreedCost ? orderDetails.AgreedCost : ''}`, 165, 174);
        doc.line(5.5, 176, 205.5, 176);

        doc.text(`Infra Charges`, 10, 181);
        doc.text(`${orderDetails.InfraCharge ? orderDetails.InfraCharge : 0}`, 165, 181);
        doc.line(5.5, 183, 205.5, 183);

        doc.setFontSize(12);
        doc.text(`Total Agreement Value`, 100, 187, null, null, 'center');
        doc.text(`${orderDetails.SubTotal ? orderDetails.SubTotal : ''}`, 165, 187);
        doc.line(5.5, 190, 205.5, 190);

        doc.setFontSize(11);
        doc.text(`Stamp Duty ` + `${orderDetails.PercentStampDuty ? orderDetails.PercentStampDuty : 0}` + ` %`, 10, 195);
        doc.text(`${orderDetails.StampDuty ? orderDetails.StampDuty : 0}`, 165, 195);
        doc.line(5.5, 197, 205.5, 197);

        doc.text(`GST ` + `${orderDetails.percentageGST ? orderDetails.percentageGST : 0}` + ` % on Infra Charges`, 10, 202);
        doc.text(`${orderDetails.GST ? orderDetails.GST : 0}`, 165, 202);
        doc.line(5.5, 204, 205.5, 204);

        doc.text(`Registration`, 10, 209);
        doc.text(`${orderDetails.Tax ? orderDetails.Tax : 0}`, 165, 209);
        doc.line(5.5, 211, 205.5, 211);

        doc.text(`TDS`, 10, 216);
        doc.text(`${orderDetails.TDS ? orderDetails.TDS : 0}`, 165, 216);
        doc.line(5.5, 218, 205.5, 218);


        doc.text(`Total Cost (Including Taxes)`, 100, 224, null, null, 'center');
        doc.text(`${orderDetails.TotalValue ? orderDetails.TotalValue : ''}`, 165, 224);
        // doc.line(5, 199, 205, 199);

        doc.setFontSize(12);
        doc.roundedRect(5.5, 232, 200, 40, 2, 2, 'S');
        doc.text('Booking Amount Details', 100, 237, null, null, 'center');
        doc.setFontSize(11);

        doc.text(`Booking Amount Paid : `, 10, 244);
        doc.text(`${orderDetails.BookingAmount ? orderDetails.BookingAmount : ''}`, 60, 244);
        doc.line(48, 245, 80, 245);
        doc.text(`By Cash / Draft / Cheque No. `, 81, 244);
        doc.text(`${orderDetails.ChequeNumber ? orderDetails.ChequeNumber : ''}`, 130, 244);
        doc.line(128, 245, 155, 245);

        doc.text(` Dated `, 156, 244);
        doc.text(`${orderDetails.ChequeDate ? new Date(orderDetails.ChequeDate).toLocaleDateString() : ''}`, 169, 244);
        doc.line(167, 245, 204, 245);

        doc.text(`Drawn On  `, 10, 251);
        doc.text(`${orderDetails.ChequeBankName ? orderDetails.ChequeBankName : ''}`, 29, 251);
        doc.line(28, 252, 90, 252);
        doc.text(`Bank.  `, 91, 251);

        //------New Page Added in PDF-----//
        doc.addPage();
        doc.rect(5, 5, 200, 288);
        doc.setFontSize(11);
        if (orderDetails.ProjectName && orderDetails.ProjectName.toLowerCase() === 'kekarav') {
          doc.text(20, 11, 'I / We know that the application is tentative and shall only be finalized on your acceptance of the same by');
          doc.text(20, 18, 'execution of the agreement of the sale within 30 from the date hereof.');
          doc.text(22, 30, '1. I / We accept the terms and conditions mentioned in the Agreement. Please book my Flat in your scheme.');
          doc.text(22, 37, '2. I / We also agree to pay all your payments as per the progress of Flat / Building.');
          doc.text(22, 44, '3. I / We agree to pay above mentioned Taxes if applicable any as and when demanded.');
          doc.text(22, 51, '4. I / We would be entirely responsible for administration charges toward cancellation.');
          doc.text(22, 58, '5. I / We, the above applicant(s) do hereby declare that the above particulars / information');
          doc.text(25, 65, 'given by me / us are true and correct.');
          doc.text(22, 72, `6. I / We agree that the ......` + `${companyName ? companyName : ''}` + `...... reserves the right to accept or reject`);
          doc.text(25, 79, 'this booking without any reasonable cause.');
          doc.text(22, 86, '7. I / We fail to get the said agreement executed and registered within the stipulated period');
          doc.text(25, 93, 'then you are entitled to said / allot the same Flat / Apartment to any third person without.');
          doc.text(25, 100, 'taking any prior consent from me / us. In such event you will be entitled to refund the said');
          doc.text(25, 107, 'amount without interest after deduction there from costs incurred by you / administration ');
          doc.text(25, 114, 'charges by issuing a cheque of said amount in my / our name. After the stipulated period');
          doc.text(25, 121, 'of 30 days. I / We will not be entitled to make any claim in the aforesaid Flat My Bank Account');
          doc.text(25, 128, 'No. is ................................. and bank is ...................... I / We hereby authorize you to deposit');
          doc.text(25, 135, 'my deposit refund in my above bank account.');
          doc.text(22, 142, '8. I / We shall have no claim against you in case my / our offer stated herein has not accepted');
          doc.text(25, 149, 'by you.');
          doc.text(22, 156, '9. I / We understand and agree that this application for allotment / Booking is non transferable.');
          doc.text(22, 163, '10. I / We would be entirely responsible for administration charges 2,00,000 towards cancellation.');
          doc.text(160, 184, 'Thanking you.');
          doc.text(160, 191, `Your's Faithfully,`);
          //   var splitTitle = doc.splitTextToSize(`7. I / We fail to get the said agreement executed and registered within the stipulated period then you are entitled to said
          //   / allot the same Flat / Apartment to any third person without. taking any prior consent from me / us. In such event you will 
          //   be entitled to refund the said amount without interest after deduction there from costs incurred by you / administration charges by issuing a cheque of said amount in my / 
          //   our name. After the stipulated period of 30 days. I / We will not be entitled to make any claim in the aforesaid Flat My Bank Account 
          //   No. is ................................. and bank is ...................... I / We hereby authorize you to deposit my deposit refund in my above bank account.`, 193);
          //  doc.text(10, 86, splitTitle);
        } else {
          doc.text(22, 30, 'TERMS AND CONDITIONS OF THE APPLICATION');
          doc.text(20, 37, 'ALL THE TERMS AND CONDITIONS REMAINS SAME AS MENTIONED IN THE APPLICATION ');
          doc.text(20, 44, 'FORM SIGNED AND SUBMITTED AT THE TIME OF BOOKING.');
        }

        //------footer for PDF-------//
        doc.rect(5, 213, 200, 40);
        doc.line(70, 213, 70, 293); // vertical line
        doc.text(`Sign :`, 10, 225);
        doc.text(`Sign :`, 80, 225);
        doc.text(`Sign :`, 150, 225);
        doc.text(`Date :`, 10, 235);
        doc.text(`Date :`, 80, 235);
        doc.text(`Date :`, 150, 235);
        doc.setFontStyle("bold");
        doc.text(`Applicant No. 1`, 10, 250);
        doc.text(`Applicant No. 2`, 80, 250);
        doc.text(`Applicant No. 3`, 150, 250);
        doc.setFontStyle("normal");
        doc.rect(5, 253, 200, 40);
        doc.line(140, 213, 140, 293); // vertical line
        doc.text(`Sign :`, 10, 265);
        doc.text(`Sign :`, 80, 265);
        doc.text(`Sign :`, 150, 265);
        doc.text(`Date :`, 10, 275);
        doc.text(`Date :`, 80, 275);
        doc.text(`Date :`, 150, 275);
        doc.setFontStyle("bold");
        doc.text(`Sales Person`, 10, 290);
        doc.text(`Sales Head`, 80, 290);
        doc.text(`Director`, 150, 290);
        if (Input === 'SendEmail') {
          var xyz = doc.output('blob');
          var data = new FormData();
          data.append('data', xyz);
          var xhr = new XMLHttpRequest();
          let CreatedFile = [];
          const reader: FileReader = new FileReader();
          reader.readAsDataURL(xyz);
          reader.onload = (e) => {
            const fileAttachment: FileAttachment = new FileAttachment();
            let fileContent: any = reader.result;
            fileContent = fileContent.split('base64,')[1];
            fileAttachment.content = fileContent;
            fileAttachment.name = 'order.pdf';
            fileAttachment.type = `application/pdf`;
            fileAttachment.size = doc.size;
            fileAttachment['documentName'] = 'order';
            fileAttachment.metadata = [];
            CreatedFile.push(fileAttachment);
            resolve(CreatedFile);
          };
        } else {
          doc.output('dataurlnewwindow');
          // doc.save('order.pdf');
        }
      });
    });
    return promise;
  }
}
