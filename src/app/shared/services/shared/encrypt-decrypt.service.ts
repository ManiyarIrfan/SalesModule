import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
const encryptSecretKey = 'TRUI123456789';
@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }
  encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptSecretKey).toString();
  }

  decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, encryptSecretKey);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return data;
  }
}
