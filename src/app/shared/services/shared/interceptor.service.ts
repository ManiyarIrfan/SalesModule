import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludesArr = [
      'https://widget.kommunicate.io/v2/kommunicate.app',
      '../../../../assets/sideMenu.json',
      'RegistrationforWebinar',
      'gupshup',
      'https://file.io'
    ]
    if (!excludesArr.find(x => req.url.includes(x))) {
      const idToken = (localStorage && localStorage.getItem('LoggedinUser')) ? JSON.parse(localStorage.getItem('LoggedinUser')).token : null;
      if (idToken) {
        const cloned = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + idToken)
        });
        return next.handle(cloned)
          .pipe(<any>catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              this.router.navigate(['/login']);
              localStorage.removeItem('isLoggedin');
              localStorage.removeItem('LoggedinUser');
            } else {
              return error;
            }
          }));
      } else {
        return next.handle(req);
      }
    } else {
      return next.handle(req);
    }
  }
}
