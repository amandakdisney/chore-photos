import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Room } from '../interfaces/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private rooms$: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);
  private rooms: Room[] = [];
  private loaded: boolean = false;

  constructor(private storage: Storage) { }

  async load(): Promise<void> {
    return Promise.resolve();
  }

  getRooms(): Observable<Room[]> {
    return this.rooms$;
  }

  getRoom(roomId: string): Observable<Room> {
    return this.rooms$.pipe(
      map((rooms) =>
        rooms.find((room) => room.id === roomId)
      )
    );
  }

  async createRoom(name: string): Promise<void> {
    await this.load();

    const newRoom = {
      id: this.generateSlug(name),  //name might need to be title?
      name: name,
      photos: [],  // photos was items
    };

    this.rooms = [...this.rooms, newRoom];
    await this.save();
  }

  async updateRoom(roomId: string, newName: string): Promise<void> {
    this.rooms = this.rooms.map((room) => {
      return room.id === roomId ? { ...room, name: newName } : room;
    });

    this.save();
  }

  async removeRoom(roomId: string): Promise<void> {
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
    this.save();
  }

  save(): Promise<void> {
    this.rooms$.next(this.rooms);
    return Promise.resolve();
  }
  // name might need to change to title
  generateSlug(name: string): string {
    let slug = name.toLowerCase().replace(/\s+/g, "-");

    const matchingSlugs = this.rooms.filter((room) => {
      return room.id.substring(0, slug.length) === slug;
    });

    if (matchingSlugs.length > 0) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
