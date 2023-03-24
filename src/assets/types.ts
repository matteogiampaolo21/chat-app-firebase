export type Room = {
    readonly id:string,
    messages:Message[],
    name:string,
    users:string[]
}
export type User = {
    readonly id: string,
    readonly email:string,
    friendsArray:string[],
    friendRequest:string[],
    username:string
}

export type Message = {
    text:string,
    timeDelivered:string
}