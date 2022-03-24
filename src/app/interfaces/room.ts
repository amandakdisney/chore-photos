import { UserPhoto } from "./room-photo";

export interface Room {
    id: string;
    name: string;  // name was title
    photos: UserPhoto[];  // photos was items
}
