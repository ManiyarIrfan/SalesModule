import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class DemandLetterPdfService {

  constructor() { }
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
  // Convert Number 123456789 to currency formate like 12,34,56,789 
  numberWithCommas(x) {
    x = x.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
      afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
  }

  download(orderDetail, LeadDetail) {
    let orderDetails = {}, LeadData = {};
    Object.assign(orderDetails, orderDetail);
    Object.assign(LeadData, LeadDetail);
    LeadData['InstallmentNo'] = orderDetails['InstallmentNo'];
    LeadData['InvoiceNo'] = orderDetails['InvoiceNo'];
    LeadData['PayAgainst'] = orderDetails['PayAgainst'];
    LeadData['Percentage'] = orderDetails['Percentage'];
    LeadData['TotalDemandRaised'] = orderDetails['TotalDemandRaised'];
    LeadData['TaxReceived'] = orderDetails['TaxReceived'] ? orderDetails['TaxReceived'] : orderDetails['taxon'];
    LeadData['EstimatedBillingDate'] = orderDetails['EstimatedBillingDate'];
    LeadData['CreatedOn'] = orderDetails['CreatedOn'];
    LeadData['FlatNo'] = LeadData['FlatNo'] ? LeadData['FlatNo'] : orderDetails['FlatNo'];
    LeadData['TotalAgreedAmount'] = LeadData['SubTotal'] ? LeadData['SubTotal'] : LeadData['TotalAgreedAmount'];
    LeadData['TotalAdvanceUsed'] = orderDetail['TotalAdvanceUsed'] ? orderDetail['TotalAdvanceUsed'] : 0;
    LeadData['AdvancePayment'] = LeadData['AdvancePayment'] ? Math.round(LeadData['AdvancePayment']) : Math.round(orderDetails['AdvancePaymentUsed']);
    LeadData['AgreedCost'] = LeadData['AgreedCost'] ? LeadData['AgreedCost'] : LeadData['TotalAgreedAmount'];
    LeadData['PreTotalDemandRemaning'] = orderDetails['PreTotalDemandRemaning'] ? orderDetails['PreTotalDemandRemaning'] : 0;
    LeadData['CorrespondenceAddress'] = LeadData['CorrespondenceAddress'] ? LeadData['CorrespondenceAddress'] : (orderDetails['CorrespondenceAddress'] ? orderDetails['CorrespondenceAddress'] : '');
    LeadData['taxamount'] = LeadData['TaxReceived'] ? Math.round(LeadData['TaxReceived']) : 0;
    let infra = LeadData['InfraCharge'] * orderDetails['Percentage'] / 100;
    LeadData['infraAmount'] = infra && Math.round(infra);
    LeadData['TotalSCHEDULEAmount'] = (LeadData['TotalDemandRaised'] + LeadData['taxamount'] + LeadData['infraAmount'] + LeadData['PreTotalDemandRemaning']);
    LeadData['TotalAgreementValue'] = (LeadData['InfraCharge'] ? LeadData['InfraCharge'] : 0) + (LeadData['AgreedCost'] ? LeadData['AgreedCost'] : 0);
    LeadData['TotalAgreementValuePaid'] = (LeadData['TotalDemandRaised'] ? LeadData['TotalDemandRaised'] : 0) + (LeadData['infraAmount'] ? LeadData['infraAmount'] : 0);
    LeadData['TotalAmount'] = LeadData['TotalAgreementValue'] + (LeadData['GST'] ? LeadData['GST'] : 0);
    LeadData['TotalAmountReceived'] = orderDetail['AmountReceived'] - LeadData['TotalAdvanceUsed'];
    LeadData['AllTotalAmount'] = (LeadData['TotalSCHEDULEAmount'] - (orderDetail['TotalAdvanceUsed'] + LeadData['TotalAmountReceived']));
    let HeaderList = ('AllTotalAmount,TotalAmountReceived,TotalAdvanceUsed,TotalAgreementValue,TotalAgreementValuePaid,TotalDemandRaised,TaxReceived,TotalAgreedAmount,AgreedCost,PreTotalDemandRemaning,TotalAmount,TotalSCHEDULEAmount,infraAmount,SubTotal,GST,InfraCharge').split(',');
    HeaderList.forEach(element => {
      LeadData[element] = LeadData[element] ? this.numberWithCommas(LeadData[element]) : null;
    });

    console.log(LeadData['TotalDemandRaised']);
    var imgData = `https://truimages.blob.core.windows.net/productionimages/Document/Email/a70ea1e5-c873-4282-9753-0e5c01856a46kekaravInvoiceHeader.PNG`;
    this.toDataURL(imgData, function (dataUrl) {
      var doc = new jsPDF();
      doc.addImage(dataUrl, 'png', 5, 5, 200, 50, 'Logo');
      doc.setFontSize(11);
      doc.text(`Date : ` + `${LeadData['CreatedOn'] ? LeadData['CreatedOn'] : ''}`, 160, 60);
      doc.text(`Invoice No : ` + `${LeadData['InvoiceNo'] ? LeadData['InvoiceNo'] : ''}`, 10, 60);
      var splitTitle = doc.splitTextToSize(`Name             :`, 193);
      doc.text(10, 75, splitTitle);
      doc.text(37, 75, `${LeadData['CustomerName'] ? LeadData['CustomerName'] : ''}`); // Name of Lead
      doc.line(37, 76, 193, 76);

      splitTitle = doc.splitTextToSize(`Joint Name    :`, 193);
      doc.text(10, 82, splitTitle);
      doc.text(37, 82, `${LeadData['JointName1'] ? LeadData['JointName1'] : ''}`); // Name of Lead
      doc.line(37, 83, 193, 83);

      doc.text(10, 90, 'Address         : ');
      doc.text(37, 90, `${LeadData['CorrespondenceAddress'] ? LeadData['CorrespondenceAddress'] : ``}`); // address of Lead
      doc.line(37, 91, 193, 91);

      doc.text(`Subject:`, 10, 98);
      doc.setFontStyle('Roboto');
      doc.setFontSize(11);
      doc.text(`Payment demand towards instalment due for Plot No. : ` + `${LeadData['FlatNo'] ? LeadData['FlatNo'] : ``}`, 26, 98);
      doc.line(112, 99, 150, 99);
      doc.text(`in Sector : ` + `${LeadData['BuildingType'] ? LeadData['BuildingType'] : ''}`, 152, 98);
      doc.line(170, 99, 193, 99);
      splitTitle = doc.splitTextToSize(`at our scheme “KEKARAV” Survey 171, Bavdhan, Pune, Maharashtra 411021.`, 193);
      doc.text(10, 105, splitTitle);
      splitTitle = doc.splitTextToSize(`          As per terms and conditions of our agreement to sale in our scheme “KEKARAV” and considering progress and    stage of construction (which is duly certified by Architect), following are the details of the amount due from your end. `, 193);
      doc.text(10, 112, splitTitle);

      splitTitle = doc.splitTextToSize(`PROGRESS: MILESTONE OF PAYMENT SCHEDULE (` + `${LeadData['PayAgainst'] ? LeadData['PayAgainst'] : ``}` + `)`, 193);
      doc.text(10, 125, splitTitle);
      // **          APPLICANT                 ** //   
      doc.roundedRect(9, 129, 186, 78, 2, 2, 'S');
      // doc.roundedRect(9, 130, 186, 58, 2, 2, 'S');

      doc.setFontStyle('Georgia');
      doc.setFontSize(10);
      doc.line(100, 129, 100, 136);
      doc.text(`PROJECT : KEKARAV`, 35, 134);
      doc.text(`PLOT NO :  ` + `${LeadData['FlatNo'] ? LeadData['FlatNo'] : ``}`, 135, 134);
      doc.line(9, 136, 195, 136);

      doc.text(`SUMMARY OF DEMAND `, 83, 141);
      doc.line(9, 143, 195, 143);
      doc.text(`SR.NO`, 12, 148);
      doc.line(25, 143, 25, 188); // Vertical Line 
      doc.line(100, 143, 100, 188); // Vertical Line 
      doc.line(138, 143, 138, 207); // Vertical Line 
      // doc.line(25, 137, 25, 183);
      doc.text(`PARTICULARS`, 40, 148);

      // doc.line(85, 137, 85, 183);

      doc.text(`TOTAL AMOUNT`, 105, 148);

      doc.text(`DUE AS PER SCHEDULE (${LeadData['Percentage'] ? LeadData['Percentage'] : '0'}%)`, 143, 148);
      // doc.text(`SCHEDULE (%)`, 117, 145);
      // doc.line(138, 137, 138, 183);
      doc.line(9, 151, 195, 151);
      // doc.line(9, 152, 195, 152);
      doc.text(`1`, 15, 156);
      doc.text(`BASE VALUE (A)`, 32, 156);

      doc.text(`${LeadData['AgreedCost'] ? LeadData['AgreedCost'] : ''}`, 130, 156, { align: 'right' });
      doc.text(`${LeadData['TotalDemandRaised'] ? LeadData['TotalDemandRaised'] : ''}`, 175, 156, { align: 'right' });
      doc.line(9, 158, 195, 158);

      doc.text(`2`, 15, 163);
      doc.text(`INFRA CHARGES (B)`, 32, 163);
      doc.text(`${LeadData['InfraCharge'] ? LeadData['InfraCharge'] : ''}`, 130, 163, { align: 'right' });
      doc.text(`${LeadData['infraAmount'] ? LeadData['infraAmount'] : ''}`, 175, 163, { align: 'right' });
      doc.line(9, 164, 195, 164);

      doc.text(`3`, 15, 169);
      doc.text(`AGREEMENT VALUE (A+B)`, 32, 169);
      doc.text(`${LeadData['TotalAgreementValue'] ? LeadData['TotalAgreementValue'] : ''}`, 130, 169, { align: 'right' });
      doc.text(`${LeadData['TotalAgreementValuePaid'] ? LeadData['TotalAgreementValuePaid'] : '0'}`, 175, 169, { align: 'right' });
      doc.line(9, 170, 195, 170);

      doc.text(`4`, 15, 175);
      doc.text(`GST`, 32, 175);
      doc.text(`${LeadData['GST'] ? LeadData['GST'] : ''}`, 130, 175, { align: 'right' });
      doc.text(`${LeadData['TaxReceived'] ? LeadData['TaxReceived'] : '0'}`, 175, 175, { align: 'right' });
      doc.line(9, 176, 195, 176);


      doc.text(`5`, 15, 181);
      doc.text(`PREVIOUS DUE`, 32, 181);
      doc.text(`0`, 130, 181, { align: 'right' });
      doc.text(`${LeadData['PreTotalDemandRemaning'] ? LeadData['PreTotalDemandRemaning'] : '0'}`, 175, 181, { align: 'right' });
      doc.line(9, 182, 195, 182);

      doc.text(`TOTAL DUE BEFORE DEDUCTION (C)`, 32, 187);
      doc.text(`${LeadData['TotalAmount'] ? LeadData['TotalAmount'] : ''}`, 130, 187, { align: 'right' });

      doc.text(`${LeadData['TotalSCHEDULEAmount'] ? LeadData['TotalSCHEDULEAmount'] : '0'}`, 175, 187, { align: 'right' });
      doc.line(9, 188, 195, 188);


      doc.text(`ADVANCE PAID (D)`, 130, 193, { align: 'right' });
      // doc.text(`0`, 130, 193, { align: 'right' });
      doc.text(`${LeadData['TotalAdvanceUsed'] ? LeadData['TotalAdvanceUsed'] : '0'}`, 175, 193, { align: 'right' });
      doc.line(9, 194, 195, 194);

      doc.text(`PAID AGAINST DEMAND (E)`, 130, 199, { align: 'right' });
      doc.text(`${LeadData['TotalAmountReceived'] ? LeadData['TotalAmountReceived'] : '0'}`, 175, 199, { align: 'right' });
      doc.line(9, 200, 195, 200);


      doc.setTextColor(255, 0, 0);
      doc.text(`NET AMOUNT DUE ( C- (D+E) )`, 132, 205, { align: 'right' });
      doc.text(`${LeadData['AllTotalAmount'] ? LeadData['AllTotalAmount'] : '0'}` + `/-`, 177, 205, { align: 'right' });

      doc.setFontType("normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      splitTitle = doc.splitTextToSize(`NOTE : If Due amount is not received within 7 days from issue date of this demand letter, Allottee/s shall be bound and liable to pay interest as per State Bank of India highest Marginal Cost of Lending Rate plus 2% per annum, with monthly rests, on all the amounts which become due and payable. `, 193);
      doc.text(10, 216, splitTitle);
      splitTitle = doc.splitTextToSize(`Kindly prepare separate cheque / DD for each payment.`, 193);
      doc.text(10, 232, splitTitle);

      splitTitle = doc.splitTextToSize(`Payment should be in favour of fund Transfer / Direct Deposit Cheque, please note below mentioned bank details:-`, 193);
      doc.text(10, 238, splitTitle);


      splitTitle = doc.splitTextToSize(`Plot cost payment should be in favour of`, 193);
      doc.text(10, 245, splitTitle);
      splitTitle = doc.splitTextToSize(`Shrem Trading LLP Bhavdan Land Development Collection Rera Account`, 193);
      doc.setFontType("bold");
      doc.text(74, 245, splitTitle);
      doc.setFontType("normal");
      splitTitle = doc.splitTextToSize(`•	Bank Name- Yes Bank`, 193);
      doc.text(10, 252, splitTitle);

      splitTitle = doc.splitTextToSize(`•	A/c No- 007872500000042`, 193);
      doc.text(10, 259, splitTitle);

      splitTitle = doc.splitTextToSize(`•	IFSC No.- YESB0000078`, 193);
      doc.text(10, 265, splitTitle);

      splitTitle = doc.splitTextToSize(`•	Branch- Andheri West, Mumbai.`, 193);
      doc.text(10, 271, splitTitle);
      doc.addPage();
      splitTitle = doc.splitTextToSize(`GST payments should be in favour of`, 193);
      doc.text(10, 10, splitTitle);

      splitTitle = doc.splitTextToSize(`Shrem Trading LLP Bhavdan Land Development Collection Rera Account`, 193);
      doc.setFontType("bold");
      doc.text(70, 10, splitTitle);
      doc.setFontType("normal");
      splitTitle = doc.splitTextToSize(`•	Bank Name- Yes Bank`, 193);
      doc.text(10, 17, splitTitle);

      splitTitle = doc.splitTextToSize(`•	A/c No- 007872500000042`, 193);
      doc.text(10, 24, splitTitle);

      splitTitle = doc.splitTextToSize(`•	IFSC No.- YESB0000078`, 193);
      doc.text(10, 31, splitTitle);

      splitTitle = doc.splitTextToSize(`•	Branch- Andheri West, Mumbai.`, 193);
      doc.text(10, 38, splitTitle);

      splitTitle = doc.splitTextToSize(`In case of online transfers / Direct deposits please mail us your transfer details it requires to locate your payments and to put on your receipts.`, 193);
      doc.text(10, 45, splitTitle);

      splitTitle = doc.splitTextToSize(`RERA Registration Number : Phase 1 P52100025894`, 193);
      doc.text(10, 55, splitTitle);

      splitTitle = doc.splitTextToSize(``, 193);
      doc.text(10, 59, splitTitle);
      splitTitle = doc.splitTextToSize(``, 193);
      doc.text(10, 66, splitTitle);

      doc.setFontSize(11.5);
      splitTitle = doc.splitTextToSize(`PLEASE ENSURE THAT, NO CASH IS BEING DEPOSITED DIRECTLY IN THESE BANK ACCOUNTS.`, 193);
      doc.text(10, 70, splitTitle);

      splitTitle = doc.splitTextToSize(`In case if there is any change in the communication address/ contact details please do let us know so that we can update the same in our system.
      Email : contact@trurelty.in or contact your Relationship Manager or Sales Representative. If you have already cleared your dues please ignore the letter.
      `, 193);
      doc.text(10, 77, splitTitle);

      splitTitle = doc.splitTextToSize(`Thanking you and assuring you of our best services always.`, 193);
      doc.text(10, 98, splitTitle);

      splitTitle = doc.splitTextToSize(`For – SHREM TRADING LLP`, 193);
      doc.text(10, 130, splitTitle);

      doc.text(`Authorized signatory`, 155, 130);
      doc.output('dataurlnewwindow');
      doc.save('DemandLetter.pdf');
    });
  }
}
