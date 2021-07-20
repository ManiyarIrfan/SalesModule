import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';

export interface IchannelPartnerModel {
    Email: string;
    MobileNo: number;
    Name: string;

}
export interface IlistreferredChannelPartner {
    BrokerId: number;
    CreatedOn: Date;
    Email: string;
    MobileNo: number;
    Name: string;
    Status: string;
    VerificationReason: string;
    VerificationStatus: string;
}