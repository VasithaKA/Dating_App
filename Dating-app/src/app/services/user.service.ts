import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'api/users'

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(this.userUrl)
  }

  getAUser(id) {
    return this.http.get(this.userUrl + '/' + id)
  }

  updateUser(id, updateDetails) {
    return this.http.patch(this.userUrl + '/create/' + id, updateDetails)
  }

}
