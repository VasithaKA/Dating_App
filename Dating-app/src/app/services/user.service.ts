import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'api/users'

  constructor(private http: HttpClient) { }

  getAllUsers(page?, userParams?) {
    let params = new HttpParams()
    if (page) {
      params = params.append('page', page)
    }
    if (userParams.gender != undefined) {
      params = params.append('gender', userParams.gender)
    }
    if (userParams.minAge != undefined) {
      params = params.append('minAge', userParams.minAge)
    }
    if (userParams.maxAge != undefined) {
      params = params.append('maxAge', userParams.maxAge)
    }
    if (userParams.orderedList != undefined) {
      params = params.append('orderedList', userParams.orderedList)
    }
    return this.http.get(this.userUrl, {params})
  }

  getAUser(id) {
    return this.http.get(this.userUrl + '/' + id)
  }

  updateUser(id, updateDetails) {
    return this.http.patch(this.userUrl + '/create/' + id, updateDetails)
  }

}
