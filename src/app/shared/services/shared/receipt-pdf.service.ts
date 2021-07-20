import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ReceiptPdfService {

  constructor() { }
  convertNumberToWords(amount) {
    let value: any;
    let n_array: any;
    let words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    let atemp = amount.split(".");
    let number = atemp[0].split(",").join("");
    let n_length = number.length;
    let words_string = "";
    if (n_length <= 9) {
      let n_array: any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      let received_n_array = new Array();
      for (let i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (let i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (let i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      value = "";
      for (let i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Crores ";
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred and ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }

  toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  download(orderDetails, LeadData) {
    LeadData.InvoiceNo = orderDetails.InvoiceNo;
    LeadData.PaidAgainstDue = orderDetails.PaidAgainstDue;
    LeadData.ServiceTax = orderDetails.ServiceTax;
    LeadData.LegalEntityName = orderDetails.LegalEntityName;
    LeadData.LegalAddress = orderDetails.LegalAddress;
    LeadData.InvoiceNo = orderDetails.InvoiceNo;
    LeadData.ReceiptDate = orderDetails.ReceiptDate;
    LeadData.Name = orderDetails.Name;
    LeadData.PayBy = orderDetails.PayBy;
    LeadData.ChequeDate = orderDetails.ChequeDate;
    LeadData.BankName = orderDetails.BankName;
    LeadData.Branch = orderDetails.Branch;
    LeadData.FlatNo = orderDetails.FlatNo;
    LeadData.BuildingType = orderDetails.BuildingType;
    orderDetails.TaxReceived = orderDetails.TaxReceived ? orderDetails.TaxReceived : orderDetails.ServiceTax;
    orderDetails.InfraReceived = orderDetails.InfraReceived ? orderDetails.InfraReceived : orderDetails.Infra;
    orderDetails.AmtReceived = orderDetails.AmountReceivedinstallment ? orderDetails.AmountReceivedinstallment : orderDetails.PaidAgainstDue;

    let imgData = `https://truimages.blob.core.windows.net/productionimages/Document/Email/27a4e876-767a-40f2-a257-a58393754879kekarav_Receipt.PNG`;

    let PayAmount;
    let amtReceived = orderDetails.AmtReceived ? orderDetails.AmtReceived : 0;
    let TaxReceived = orderDetails.TaxReceived ? orderDetails.TaxReceived : 0;
    let infraReceived = orderDetails.InfraReceived ? orderDetails.InfraReceived : 0;
    let AdvancePayment = orderDetails.AdvancePayment ? orderDetails.AdvancePayment : 0;
    PayAmount = amtReceived + TaxReceived + infraReceived + AdvancePayment;
    let amount = this.convertNumberToWords(PayAmount);
    this.toDataURL(imgData, function (dataUrl) {
      let doc = new jsPDF();
      doc.addImage(dataUrl, 'png', 5, 5, 200, 50, 'Logo');
      doc.rect(5, 5, 200, 288);
      // doc.rect(5.5, 26, 199, 11, 'F');
      doc.setFontSize(11);
      doc.setFontStyle('Roboto');
      doc.text(10, 60, `Invoice No.: ` + `${LeadData.InvoiceNo ? LeadData.InvoiceNo : ''}`);
      doc.text(162, 60, `Date : ` + `${LeadData.ReceiptDate ? LeadData.ReceiptDate : ''}`);
      doc.setFontSize(12);

      var splitTitle = doc.splitTextToSize(`${LeadData.LegalEntityName ? LeadData.LegalEntityName : ''}`, 193);
      doc.text(10, 75, splitTitle);
      doc.setFontSize(11);
      splitTitle = doc.splitTextToSize(`${LeadData.LegalAddress ? LeadData.LegalAddress : ''}`, 193);
      doc.text(10, 81, splitTitle);
      splitTitle = doc.splitTextToSize(`      Received with thanks from Mr./ Mrs : ` + `${LeadData.Name ? LeadData.Name : ''}`, 193);
      doc.text(10, 95, splitTitle);
      doc.line(58, 96, 193, 96);
      splitTitle = doc.splitTextToSize(`The Sum of Rs. In Words : ` + `${amount ? amount : ''}`, 193);
      doc.text(10, 101, splitTitle);
      doc.line(52, 102, 193, 102);

      doc.text(10, 107, `By Cheque / Cash/RTGS : `);
      doc.text(52, 107, ` ${LeadData.PayBy ? LeadData.PayBy : ''}`);
      doc.line(51, 108, 94, 108);

      doc.text(95, 107, `Dated : `);
      doc.text(106, 107, ` ${LeadData.ChequeDate ? LeadData.ChequeDate : ''}`);
      doc.line(106, 108, 129, 108);

      doc.text(130, 107, `Drawn On : `);
      doc.text(152, 107, ` ${LeadData.BankName ? LeadData.BankName : ''}`);
      doc.line(150, 108, 193, 108);


      splitTitle = doc.splitTextToSize(`${LeadData.Branch ? LeadData.Branch : ''}`, 193);
      doc.text(162, 113, `Branch Towards.`);
      doc.text(10, 113, splitTitle);
      doc.line(10, 114, 160, 114);

      doc.text(10, 120, `Booking of Flat / Plot No. : `);
      doc.text(60, 120, ` ${LeadData.FlatNo ? LeadData.FlatNo : ''}`);
      doc.line(53, 121, 94, 121);

      doc.text(95, 120, `Building / Sector No.: `);
      doc.text(140, 120, ` ${LeadData.BuildingType ? LeadData.BuildingType : ''}`);
      doc.line(130, 121, 193, 121);

      doc.text(10, 126, `Books / OCP / PP / SDR / VAT / ST / GST / Advance Payment RS.`);
      doc.text(116, 126, ` ${PayAmount ? PayAmount : ''}`);
      doc.line(117, 127, 150, 127);

      doc.setFontSize(12);
      splitTitle = doc.splitTextToSize(`In Kekarav`, 193);
      doc.text(10, 140, splitTitle);
      doc.setFontSize(11);

      splitTitle = doc.splitTextToSize(`Subject to Realization of Cheque`, 193);
      doc.text(10, 147, splitTitle);

      splitTitle = doc.splitTextToSize(`Subject to Pune Jurisdiction only.`, 193);
      doc.text(10, 153, splitTitle);

      splitTitle = doc.splitTextToSize(`For,`, 193);
      doc.text(140, 165, splitTitle);

      splitTitle = doc.splitTextToSize(`${LeadData.LegalEntityName ? LeadData.LegalEntityName : ''}`, 193);
      doc.text(140, 172, splitTitle);

      doc.output('dataurlnewwindow');
      doc.save('Receipt.pdf');
      // window.open(doc.output('bloburl'), '_blank');
      // window.open(doc.save('Receipt.pdf'));
    });
  }
}
