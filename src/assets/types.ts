export type Room = {
    messages:Message[],
    name:string,
    users:string[]
}

type Message = {
    text:string,
    timeDelivered:string
}