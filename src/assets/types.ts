export type Room = {
    readonly id:string,
    messages:Message[],
    name:string,
    users:string[]
}

export type Message = {
    text:string,
    timeDelivered:string
}