import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams} from "react-router-dom"
import { Message } from "../assets/types";

export const Rooms = () => {


    const [user] = useAuthState(auth);
    const [userRoom, setRoom] = useState<DocumentData>({})
    const [isLoading, setLoading] = useState<boolean>(true)
    
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
                <div className="message">
                  <p key={index}>{message.text}</p>
                </div>
              )
            })}
            <form className="message-form">
            <input className="dark-input" type="text" />
            <button className="success-btn" type="submit">Send</button>
            </form>
          </div>
        </div>
        :
        <div></div>
        }
      </div>
    )
}

