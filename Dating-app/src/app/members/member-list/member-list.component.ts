import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  allUserDetails: any

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.allUserDetails = data
    }, error => {
      this.alertifyService.error(error.error.message || error.error.error.message )
    })
  }

}
