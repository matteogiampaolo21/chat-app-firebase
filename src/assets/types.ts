export type Room = {
    readonly id:string,
    messages:Message[],
    name:string,
    users:string[]
}
export type Contact = {
    readonly id:string,
    messages:Message[],
    users:string[]
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
    text:string,
    timeDelivered:string
}