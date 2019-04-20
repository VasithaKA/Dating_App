import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userUrl = 'api/users/'
  private jwtHelper = new JwtHelperService();
  private decodedToken: any

  constructor(
    private http: HttpClient,
    private alertifyService: AlertifyService) { }

  get getLoginDetails() {
    return this.jwtHelper.decodeToken(localStorage.getItem('token'))
  }

  get mainPhotoUrl() {
    return localStorage.getItem('mainPhotoUrl')
  }

  login(loginDetails) {
    return this.http.post(this.userUrl + "login", loginDetails).pipe(map((res: any) => {
      if (res.token) {
        this.alertifyService.success(res.message)
        localStorage.setItem('token', res.token)
        localStorage.setItem('mainPhotoUrl', res.mainPhotoUrl)
      }
    }))
  }

  register(registerDetails) {
    return this.http.post(this.userUrl + "signup", registerDetails)
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'))
  }

}
