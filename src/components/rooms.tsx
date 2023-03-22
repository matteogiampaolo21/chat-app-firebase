import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { DocumentData, doc, getDoc, addDoc, query, where, onSnapshot , collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams} from "react-router-dom"
import { Message } from "../assets/types";
import "../styles/rooms.css"

export const Rooms = () => {


    const [user] = useAuthState(auth);
    const [userRoom, setRoom] = useState<DocumentData>({})
    const [isLoading, setLoading] = useState<boolean>(true)
    const [inputText, setText] = useState<string>("")
    
    let { roomId } = useParams();

    useEffect(() => {
        const getDocument = async () => {
          const docRef = doc(db, "rooms", `${roomId}`);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const obj = docSnap.data();
            obj.id = docSnap.id;
            setRoom(obj);
            setLoading(false)
          } else {
            console.log("No such document!");
          }
            
        }
        getDocument()

    }, []);

    const handleClick = async () => {
      const timeSent = (new Date()).toString();
      const currentMessageArray:Message[] = (userRoom.messages)
      currentMessageArray.push({timeDelivered:timeSent,text:inputText});
      console.log(currentMessageArray)
      setText("")
    }

    return (
      <div>
        { !isLoading ?
        <div className="single-room-grid">
          <div className="sidebar">
            <h2>{userRoom.name}</h2>
            {userRoom.users.map((user:string,index:number)=>{
              return(
                <p key={index}>{user}</p>
              )
            })}
            
          </div>
          <div className="message-box">
            <h2>Chat</h2>
            {userRoom.messages.map((message:Message,index:number)=>{
              return(
                <div key={index} className="message">
                  <p>{message.text}</p>
                </div>
              )
            })}
            <form className="message-form">
            <input onChange={(e)=>{setText(e.target.value)}} value={inputText} className="dark-input" type="text" />
            <button onClick={handleClick} className="blue-btn" type="button">Send</button>
            </form>
          </div>
        </div>
        :
        <div></div>
        }
      </div>
    )
}

