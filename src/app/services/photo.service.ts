import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { UserPhoto } from '../interfaces/room-photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];

  constructor() { }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    

    // const savedImageFile = await this.savePicture(capturedPhoto);
    // this.photos.unshift(savedImageFile);

    // this.photos.unshift({
    //   filepath: "soon...",
    //   webviewPath: capturedPhoto.webPath
    // });
  }

  private async savePicture(photo: Photo) {}
}

// Interface added here in myfirstapp tutorial, moved to interfaces/room-photo.ts

// export interface UserPhoto {
//   filepath: string;
//   webviewPath: string;
// }
