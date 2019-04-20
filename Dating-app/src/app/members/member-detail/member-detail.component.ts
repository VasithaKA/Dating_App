import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  aUserDetails: any
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadUser()

    this.galleryOptions = [
      {
        width: '700px',
        height: '500px',
        imagePercent: 150,
        thumbnailsColumns: 6,
        imageAnimation: NgxGalleryAnimation.Slide
      }
    ]

  }

  loadUser() {
    this.userService.getAUser(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(userData => {
      this.aUserDetails = userData
      this.galleryImages = this.getImages()
    }, error => {
      this.alertifyService.error(error.error.message || error.error.error.message)
    })
  }

  getImages() {
    const imgUrl = []
    this.aUserDetails.result.photos.forEach(element => {
      imgUrl.push({
        small: element.url,
        medium: element.url,
        big: element.url,
        description: element.description
      })
    });
    return imgUrl
  }

}
