import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Photo } from '@capacitor/camera';

import { ActivatedRoute } from '@angular/router';
import { AlertController, IonList } from '@ionic/angular';
import { RoomService } from '../services/room.service';
import { Room } from '../interfaces/room';
import { UserPhoto } from '../interfaces/room-photo';
import { Subscription } from 'rxjs';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit, OnDestroy {
  @ViewChild(IonList, { static: false }) slidingList: IonList;
  private roomSubscription: Subscription;

  private room: Room = {
    id: "",
    name: "",
    photos: [],
  };

  constructor(
    public photoService: PhotoService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private roomService: RoomService
    ) { }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.roomSubscription = this.roomService.getRoom(id).subscribe((room) => {
      this.room = room;
    });
  }

  ngOnDestroy() {
    if (this.roomSubscription !== null) {
      this.roomSubscription.unsubscribe();
    }
  }
}
