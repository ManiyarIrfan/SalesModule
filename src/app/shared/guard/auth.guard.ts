import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public loggedInuserDetails: any; 
  constructor(private router: Router) { }

  canActivate() {
      if (localStorage.getItem('isLoggedin')) {
          this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
          if (this.loggedInuserDetails) {
              return true;
          }
      }

      this.router.navigate(['/login']);
      return false;
  }
}
