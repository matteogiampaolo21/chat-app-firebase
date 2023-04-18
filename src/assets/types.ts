import { Timestamp } from "firebase/firestore"

export type Room = {
    readonly id:string,
    name:string,
    users:string[]
}
export type Contact = {
    readonly id:string,
    messages:Message[],
    users:string,

}

export type User = {
    readonly id: string,
    readonly email:string,
    friendsArray:string[],
    friendRequest:FriendRequest[],
    username:string
}

export type FriendRequest = {
    readonly email: string,
    readonly id: string
}

export type Message = {
    readonly id: string,
    createdAt: string,
    location: string,
    locationID:string,
    message: string,
    user: string,
    firebaseCreatedAt: Timestamp,
}