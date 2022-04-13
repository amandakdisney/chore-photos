import { Injectable } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public static URL;
  imgURL;
  selectedPhoto;
  public static loading;

  constructor(
    public camera: Camera,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {}

  public async takeImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      allowEdit: false,
      targetHeight: 500,
      targetWidth: 500,
    }

      this.camera.getPicture(options).then((imageData) => {
      this.selectedPhoto=this.dataURLtoBlob('data: image/jpeg;base64, ' + imageData);
    },(err) => {
      console.log('error', err);
    });

  }

  dataURLtoBlob(dataURL) {
    let binary = atob(dataURL.split(',')[1]);
    let array = [];
    for(let i=0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };
}


