import { UserPhoto } from "./room-photo";

export interface Room {
    id: string;
    name: string;
    photos: UserPhoto[];  
}
