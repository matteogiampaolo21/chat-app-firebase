import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { DocumentData, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams} from "react-router-dom"
import { Message } from "../assets/types";
import "../styles/rooms.css"

export const Rooms = () => {


    const [user] = useAuthState(auth);
    const [userRoom, setRoom] = useState<DocumentData>({})
    const [isLoading, setLoading] = useState<boolean>(true)
    const [inputText, setText] = useState<string>("")
    const [newUser, setNewUser] = useState<string>("")
    
    let { roomId } = useParams();

    useEffect(() => {
        const getDocument = async () => {

          const docRef = doc(db, "rooms", `${roomId}`);

          onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const obj = docSnap.data();
              obj.id = docSnap.id;
              setRoom(obj);
              setLoading(false)
            } else {
              console.log("No such document!");
            }
          })
          // const docSnap = await getDoc(docRef);
          
          // if (docSnap.exists()) {
          //   const obj = docSnap.data();
          //   obj.id = docSnap.id;
          //   setRoom(obj);
          //   setLoading(false)
          // } else {
          //   console.log("No such document!");
          // }
            
        }
        getDocument()

    }, []);

    const handleClick = async () => {
      const timeSent = (new Date()).toString();
      const currentMessageArray:Message[] = (userRoom.messages)
      currentMessageArray.push({timeDelivered:timeSent,text:inputText});
      
      const roomRef = doc(db, "rooms", `${roomId}`);

      await updateDoc(roomRef, {
        messages: currentMessageArray
      });
      setText("");
    }
    const handleAddUser = async () => {
      const currentUserArray:string[] = (userRoom.users); 
      currentUserArray.push(newUser);

      const roomRef = doc(db, "rooms", `${roomId}`);

      await updateDoc(roomRef, {
        users: currentUserArray
      });
      setNewUser("");
      
    }

    return (
      <div>
        { !isLoading ?
        <div className="single-room-grid">
          <div className="sidebar diagonal-lines">
            <h2>{userRoom.name}</h2>
            <div className="add-user-box">
              <input onChange={(e)=>{setNewUser(e.target.value)}} value={newUser} className="dark-input" placeholder="Add user"></input>
              <button onClick={handleAddUser} className="dark-btn green-hover">+</button>
            </div>

            <h3>User list:</h3>
            <ul>
            {userRoom.users.map((user:string,index:number)=>{
              return(
                <li key={index}><p>{user}</p></li>
              )
            })}
            </ul>
            
          </div>
          <div className="message-box triangle-dots">
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

