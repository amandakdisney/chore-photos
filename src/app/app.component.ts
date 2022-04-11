import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
// import { StatusBar } from '@capacitor/status-bar';
import { RoomService } from './services/room.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private roomService: RoomService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.roomService.load();

    SplashScreen.hide().catch((err) => {
      console.warn(err);
    });
  }
}
