import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import { resolve } from 'url';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
@Injectable({
  providedIn: 'root'
})
export class EoipdfService {
  public uploadServiceRequestImages: FileAttachment[] = [];
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
  printPdf(LeadData, Input) {
    let promise = new Promise((resolve) => {
      this.toDataURL(`https://truimages.blob.core.windows.net/projectstatus/Document/Email/23c3827c-aaba-4a68-b099-9bac558e40c7kekaravpdfheader.png`, function (dataUrl) {
        var doc = new jsPDF();
        doc.addImage(dataUrl, 'png', 5, 5, 200, 50, 'Logo');
        doc.setFontSize(11);
        doc.text(`Priority No: ` + `${LeadData.PriorityNo ? LeadData.PriorityNo : ''}`, 10, 60);
        doc.text(`Date : ` + `${LeadData.CreatedOn ? LeadData.CreatedOn : ''}`, 160, 60);
        var splitTitle = doc.splitTextToSize(`Shrem Trading LLP \nSurvey 171,Bavdhan\nPune 411021`, 193);
        doc.text(10, 75, splitTitle);
        doc.setFontStyle('Roboto');
        doc.text(`Dear Sirs/ Madam`, 10, 92);
        doc.text(`` + `${LeadData.FirstName ? LeadData.FirstName : ''}` + ' ' + `${LeadData.LastName ? LeadData.LastName : ''}`, 45, 92);
        splitTitle = doc.splitTextToSize(`    I am Interested in plot size of ` + ' ' + `${LeadData.PlotSize ? LeadData.PlotSize : ''}` + ' ' + ` and my budget is Rs.` + ' ' + `${LeadData.Budget ? LeadData.Budget : ''}` + ' ' + `in your proposed project KEKARAV situated at Bavdhan, Pune.\n    I am aware that this is just an expression of interest and not any offer for Sale/Allotment/Booking etc.`, 193);
        doc.text(10, 98, splitTitle);
        doc.setFontSize(12);
        // **          APPLICANT                 ** //   
        doc.roundedRect(9, 115, 193, 57, 4, 4, 'S');
        doc.fromHTML('<b>APPLICANT</b>', 92, 114)
        doc.setFontStyle('Georgia');
        doc.setFontSize(11);
        doc.text(`Mr./Mrs/Ms./M/S :` + `${LeadData.FirstName ? LeadData.FirstName : ''}` + ' ' + `${LeadData.LastName ? LeadData.LastName : ''}`, 15, 126);
        doc.line(45, 127, 195, 127);

        doc.text(`TRU CUSTOMER ID (If Applicable): ` + `${LeadData.TReferralId ? LeadData.TReferralId : ''}`, 15, 134);
        doc.line(75, 135, 195, 135);

        doc.text(`ADDRESS : ` + `${LeadData.AddressLine1 ? LeadData.AddressLine1 : ''}`, 15, 142);
        doc.line(35, 143, 195, 143);

        doc.text(`CITY : ` + `${LeadData.City ? LeadData.City : ''}`, 15, 150);
        doc.line(27, 151, 69, 151);

        doc.text(`STATE : ` + `${LeadData.State ? LeadData.State : ''}`, 70, 150);
        doc.line(85, 151, 139, 151);

        doc.text(`PIN CODE : ` + `${LeadData.PinCode ? LeadData.PinCode : ''}`, 140, 150);
        doc.line(160, 151, 195, 151);

        doc.text(`OCCUPATION : ` + `${LeadData.Occupation ? LeadData.Occupation : ''}`, 15, 158);
        doc.line(43, 159, 69, 159);

        doc.text(`MOBILE : ` + `${LeadData.MobileNo ? LeadData.MobileNo : ''}`, 70, 158);
        doc.line(88, 159, 119, 159);

        doc.text(`EMAIL : ` + `${LeadData.ReferralEmail ? LeadData.ReferralEmail : ''}`, 120, 158);
        doc.line(135, 159, 195, 159);

        doc.text(`PAN NUMBER : ` + `${LeadData.PanNo ? LeadData.PanNo : ''}`, 15, 166);
        doc.line(43, 167, 79, 167);

        doc.text(`AADHAR NUMBER : ` + `${LeadData.AdharCard ? LeadData.AdharCard : ''}`, 80, 166);
        doc.line(117, 167, 195, 167);

        doc.roundedRect(9, 180, 193, 26, 4, 4, 'S');
        doc.setFontSize(12);

        // **          TOKEN DETAILS                 ** //
        doc.setFontStyle('Roboto');
        doc.fromHTML('<b>TOKEN DETAILS</b>', 88, 180);
        doc.setFontStyle('Georgia');
        doc.setFontSize(11);
        doc.text(`Name of Bank :` + `${LeadData.TokenAmount_Bankname ? LeadData.TokenAmount_Bankname : ''}`, 15, 192);
        doc.line(40, 193, 195, 193);

        doc.text(`Cheque No :` + `${LeadData.TokenAmount_ChequeNo ? LeadData.TokenAmount_ChequeNo : ''}`, 15, 200);
        doc.line(35, 201, 79, 201);

        doc.text(`Amount :` + `${LeadData.Token_Amount ? LeadData.Token_Amount : ''}`, 80, 200);
        doc.line(95, 201, 139, 201);

        doc.text(`Date :` + `${LeadData.Token_ChequeDate ? formatDate(new Date(LeadData.Token_ChequeDate).toISOString(), 'd MMM y', 'en') : ''}`, 140, 200);
        doc.line(150, 201, 195, 201);


        // **          SOURCE OF ENQUIRY                ** //
        doc.roundedRect(9, 214, 193, 51, 4, 4, 'S');
        doc.setFontSize(12);
        doc.setFontStyle('Roboto');
        doc.fromHTML('<b>SOURCE OF ENQUIRY</b>', 82, 214);
        doc.setFontStyle('Georgia');
        doc.setFontSize(11);
        doc.text(`Source :` + `${LeadData.Source ? LeadData.Source : ''}`, 15, 226);
        doc.line(28, 227, 119, 227);

        doc.text(`If Other :` + ``, 120, 226);
        doc.line(135, 227, 195, 227);

        doc.text(`Tru Id / Firm Name(Channel Partner) :` + `${LeadData.Source === 'Channel Partner Referral' && LeadData.ReferredById ? LeadData.ReferredById : ''} - ${LeadData.Source === 'Channel Partner Referral' && LeadData.ReferredByName ? LeadData.ReferredByName : ''} - ${LeadData.Organization ? LeadData.Organization : ''}`, 15, 234); doc.line(76, 235, 195, 235);

        doc.text(`Executive Name :` + `${LeadData.ReferredBy ? LeadData.ReferredBy : ''}`, 15, 242);
        doc.line(43, 243, 119, 243);

        doc.text(`Contact Number :` + `${LeadData.Source === 'Channel Partner Referral' && LeadData.ReferredByMobileNo ? LeadData.ReferredByMobileNo : ''}`, 120, 242);
        doc.line(148, 243, 195, 243);

        doc.text(`Tru Id / Firm Name(CRO) :` + `${LeadData.CROFirmName ? LeadData.CROFirmName : ''}`, 15, 250);
        doc.line(58, 251, 119, 251);

        doc.text(`Contact Number(CRO) :` + `${LeadData.Source === 'CRO Referral' && LeadData.ReferredByMobileNo ? LeadData.ReferredByMobileNo : ''}`, 120, 250);
        doc.line(159, 251, 195, 251);

        doc.text(`Referred By (Reference) :` + `${LeadData.ReferredBy ? LeadData.ReferredBy : ''}`, 15, 258);
        doc.line(56, 259, 195, 259);

        doc.addPage();

        // **          MY REFERENCES WHO WOULD BE INTRESTED TO KNOW MORE              ** //
        doc.roundedRect(9, 10, 193, 29, 4, 4, 'S');
        doc.setFontSize(12);
        doc.setFontStyle('Roboto');
        doc.fromHTML('<b>MY REFERENCES WHO WOULD BE INTRESTED TO KNOW MORE</b>', 45, 10);
        doc.setFontStyle('Georgia');
        doc.setFontSize(11);
        doc.text(`1.Name :` + `${LeadData.Referral1_Name ? LeadData.Referral1_Name : ''}`, 15, 23);
        doc.line(29, 24, 119, 24);

        doc.text(`Contact Number :` + `${LeadData.Referral1_ContactNo ? LeadData.Referral1_ContactNo : ''}`, 120, 23);
        doc.line(148, 24, 195, 24);

        doc.text(`2.Name :` + `${LeadData.Referral2_Name ? LeadData.Referral2_Name : ''}`, 15, 31);
        doc.line(29, 32, 119, 32);

        doc.text(`Contact Number :` + `${LeadData.Referral2_ContactNo ? LeadData.Referral2_ContactNo : ''}`, 120, 31);
        doc.line(148, 32, 195, 32);


        // **          BANK DETAILS FOR REFUND OF EOI              ** //
        doc.roundedRect(9, 47, 193, 42, 4, 4, 'S');
        doc.setFontSize(12);
        doc.setFontStyle('Roboto');
        doc.fromHTML('<b>BANK DETAILS FOR REFUND OF EOI</b>', 59, 46);
        doc.setFontStyle('Georgia');

        doc.setFontSize(11);
        doc.text(`Name of Beneficiary :` + `${LeadData.BeneficiaryName ? LeadData.BeneficiaryName : ''}`, 15, 59);
        doc.line(50, 60, 99, 60);

        doc.text(`Name of Bank :` + `${LeadData.BankName ? LeadData.BankName : ''}`, 100, 59);
        doc.line(125, 60, 195, 60);

        doc.text(`Branch :` + `${LeadData.Branch ? LeadData.Branch : ''}`, 15, 67);
        doc.line(28, 68, 99, 68);

        doc.text(`Account Number :` + `${LeadData.AccountNo ? LeadData.AccountNo : ''}`, 100, 67);
        doc.line(129, 68, 195, 68);

        doc.text(`IFSC Code :` + `${LeadData.IFSCCode ? LeadData.IFSCCode : ''}`, 15, 75);
        doc.line(35, 76, 99, 76);

        doc.text(`Account Type :` + `${LeadData.AcType ? LeadData.AcType : ''}`, 100, 75);
        doc.line(125, 76, 195, 76);

        doc.text(`A cancelled cheque hard copy is attached :`, 15, 82);

        // **         DECLARATION AND UNDERTAKING             ** //
        doc.fromHTML('<b>DECLARATION AND UNDERTAKING :</b>', 10, 100);
        // doc.text(`DECLARATION AND UNDERTAKING :`, 10, 110);
        doc.setFontSize(10);
        doc.setFontStyle('Courier New');
        splitTitle = doc.splitTextToSize(`      I hereby fill this non-binding expression of interest form in kekarav. I understand that booking for kekarav have not been opend yet. i hereby submit my interest to bye the above-mentioned plotsin the project kekarav at Bavdhan as and when you choose to open the booking to the general public. I am fully aware of the fact that statutory approvals including MAHARERA are currently under process and not yet obtained. I do understand that allowcation of plots will be the sole discretion of Shrem Trading LLp. Shrem Trading LLP at its sole discretion may choose to cancel/reject the expression of intrest without assigning any reason whatsoever. Shrem Trading LLP reserve the rights to release specific number of plots during pre-launching state at an exclusive price. I also agree and accept that the EOI shall become definitive only after the completion of the process of Allotment/Booking 7 upon issuance of date of futher communication.`, 193);
        doc.text(10, 117, splitTitle);

        splitTitle = doc.splitTextToSize(`      I also agree and accept that the EOI made by me is for the specific plots (as mentioned above) in your project Kekarav (Subject to the availability of the same) and shall not be altered nor shall be utilized for allotment/booking for any other plot.`, 193);
        doc.text(10, 146, splitTitle);

        splitTitle = doc.splitTextToSize(`      I also agree to submit my complete details along with token amount immediately on intimation of EOI selection & shall regester the agreement within 15days from the date of allotment booking.`, 193);
        doc.text(10, 155, splitTitle);

        splitTitle = doc.splitTextToSize(`      I also agree to accept that I will not be allowed to withdraw the Allotment/Booking once EOI is selected and the token amount is paid. And where as i can cancel the EOI before allotment booking is completed.`, 193);
        doc.text(10, 164, splitTitle);

        splitTitle = doc.splitTextToSize(`      I also agree and accept that, In case the EOI is canceled (before the Allotment/Booking) the token amount will be refunded.on or before 15 days from the date of cancellation.`, 193);
        doc.text(10, 173, splitTitle);

        splitTitle = doc.splitTextToSize(`      I also agree and accept that, after having fully understood all the aforesaid terms and conditions and after unconditional acceptance thereof & I agree to abide by the same.`, 193);
        doc.text(10, 182, splitTitle);
        doc.text(`Sales Manager`, 20, 210);
        doc.line(10, 205, 60, 205);

        doc.text(`Applicant Signature`, 155, 210);
        doc.line(145, 205, 192, 205);
        // doc.output('dataurlnewwindow', "_blank");
        //doc.output('eoipdf');
        Input === 'GeneratePDF' ? window.open(doc.save('eoipdf.pdf')) : null;
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
            fileAttachment.name = 'EOI.pdf';
            fileAttachment.type = `application/pdf`;
            fileAttachment.size = doc.size;
            fileAttachment['documentName'] = 'EOI';
            fileAttachment.metadata = [];
            CreatedFile.push(fileAttachment);
            resolve(CreatedFile);
          };
        }
      });
    });
    return promise;

  }
}