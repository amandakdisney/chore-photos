import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, IonList, IonContent, NavController } from '@ionic/angular';
import { RoomService } from "../services/room.service";
import { Room } from '../interfaces/room';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonList, { static: false}) slidingList: IonList;
  @ViewChild(IonContent, { static: false }) contentArea: IonContent;

  public rooms: Room[] = [];

  constructor(
    private roomService: RoomService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
  ) {}

  async ngOnInit() {
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  async addRoom(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: "New Room",
      message: "Enter the name of the room to be added below:",
      inputs: [
        {
          type: "text",
          name: "name"
        },
      ],
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Save",
          handler: async (data) => {
            await this.roomService.createRoom(data.name);
            this.contentArea.scrollToBottom(300);
          },
        },
      ],
    });
    alert.present();
  }

  async renameRoom(room: Room): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: "Rename Room",
      message: "Enter the new name of this room below:",
      inputs: [
        {
          type: "text",
          name: "name",
        },
      ],
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Save",
          handler: async(data) => {
            await this.roomService.updateRoom(room.id, data.name);
            this.slidingList.closeSlidingItems();
          },
        },
      ],
    });
    alert.present();
  }

  async removeRoom(room: Room): Promise<void> {
    await this.slidingList.closeSlidingItems();
    this.roomService.removeRoom(room.id);
  }

}
