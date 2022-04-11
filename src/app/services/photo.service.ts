import { Injectable } from '@angular/core';

// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Filesystem, Directory } from '@capacitor/filesystem';
// import { Storage } from '@capacitor/storage';

// imported back in to make array of photos
import { UserPhoto } from '../interfaces/room-photo';

// import { Platform } from '@ionic/angular';
// import { Capacitor } from '@capacitor/core';


import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, NavController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
// replaces import from firebaseConfig.ts in new app
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
// export class PhotoService {
//   public photos: UserPhoto[] = [];
//   private PHOTO_STORAGE: string = 'photos';
//   private platform: Platform;

//   constructor(platform: Platform) {
//     this.platform = platform;
//   }

//   public async addNewToGallery() {
//     const capturedPhoto = await Camera.getPhoto({
//       resultType: CameraResultType.Uri,
//       source: CameraSource.Camera,
//       quality: 100
//     });

//     const savedImageFile = await this.savePicture(capturedPhoto);

//     this.photos.unshift(savedImageFile);

//     Storage.set({
//       key: this.PHOTO_STORAGE,
//       value: JSON.stringify(this.photos),
//     });
//   }

//   private async savePicture(photo: Photo) {
//     const base64Data = await this.readAsBase64(photo);

//     const fileName = new Date().getTime() + '.jpg';
//     const savedFile = await Filesystem.writeFile({
//       path: fileName,
//       data: base64Data,
//       directory: Directory.Data
//     });

//     if (this.platform.is('hybrid')) {
//       return {
//         filepath: savedFile.uri,
//         webviewPath: Capacitor.convertFileSrc(savedFile.uri)
//       };
//     } else {
//     return {
//       filepath: fileName,
//       webviewPath: photo.webPath
//     };
//   }
// }

//   private async readAsBase64(photo: Photo) {
//     if (this.platform.is('hybrid')) {
//       const file = await Filesystem.readFile({
//         path: photo.path
//       });

//       return file.data;
//     } else {}

//     const response = await fetch(photo.webPath!);
//     const blob = await response.blob();

//     return await this.convertBlobToBase64(blob) as string;
//   }

//   private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onerror = reject;
//     reader.onload = () => {
//       resolve(reader.result);
//     };
//     reader.readAsDataURL(blob);
//   });

//   public async loadSaved() {
//     const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
//     this.photos = JSON.parse(photoList.value) || [];

//     if (!this.platform.is('hybrid')) {

//     for (let photo of this.photos) {
//       // Read each saved photo's data from the Filesystem
//       const readFile = await Filesystem.readFile({
//         path: photo.filepath,
//         directory: Directory.Data,
//       });
    
//       // Web platform only: Load the photo as base64 data
//       photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
//       }
//     }
//   }

// }

export class PhotoService {
  // adding in photo array
  

  public static URL;
  imgURL;
  selectedPhoto;
  public static loading;

  constructor(
    public camera: Camera,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {}

  takeImage() {
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

    // trying to add new photo to array
    
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


