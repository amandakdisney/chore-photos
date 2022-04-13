import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertController, IonList } from '@ionic/angular';
import { RoomService } from '../services/room.service';
import { Room } from '../interfaces/room';
import { UserPhoto } from '../interfaces/room-photo';
import { PhotoService } from '../services/photo.service';
import { Subscription } from 'rxjs';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { ActionSheetController } from '@ionic/angular';


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

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  UploadedFileUrl: Observable<string>;
  images: Observable<UserPhoto[]>;

  fileName: string;
  fileSize: number;

  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<UserPhoto>;

  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    ) {
      this.isUploading = false;
    this.isUploaded = false;
    // assign collection where photos will upload
    this.imageCollection = database.collection<UserPhoto>('chore-photo');
    this.images = this.imageCollection.valueChanges();
    }

  addPhotoToGallery() {
    this.photoService.takeImage();
  }

  async ngOnInit() {
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

  uploadFile(event: FileList) {
    const file = event.item(0);
    // validates for images only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type.')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;
    this.fileName = file.name;
    // storage path
    const path = `chore-photos/${new Date().getTime()}_${file.name}_${this.room.name}`;
    // file reference
    const fileRef = this.storage.ref(path);
    // metadata
    const customMetadata = { app: 'chore-photos' };

    this.task = this.storage.upload(path, file, {customMetadata});

    //file progress
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        // retrieve uploaded file storage path
        this.UploadedFileUrl = fileRef.getDownloadURL();

        this.UploadedFileUrl.subscribe(resp=>{
          this.addImagetoDB({
            filepath: resp,
            webviewPath: resp, // might need to be changed here and in room-photo.ts, has size as property in upload tutorial
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap=> {
        this.fileSize = snap.totalBytes;
      })
    )
  }

  addImagetoDB(image: UserPhoto) {
    // create an ID for photo
    const id = this.database.createId();
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }
}
