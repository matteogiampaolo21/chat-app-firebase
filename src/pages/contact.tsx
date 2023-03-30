import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { DocumentData, doc, getDoc, updateDoc, onSnapshot, collection, where, query} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams} from "react-router-dom"
import { Message } from "../assets/types";
import "../styles/rooms.css"

export const Contact = () => {
    const [user] = useAuthState(auth);
    const [userContact, setContact] = useState<DocumentData>({})
    const [isLoading, setLoading] = useState<boolean>(true)
    const [inputText, setText] = useState<string>("");
    const [friendList, setList] = useState<string[]>([])

    const [nickname,setNickname] = useState<string>("")
    
    
    let { contactId } = useParams();

    useEffect(() => {
        const getDocument = async () => {

          const contactsRef = doc(db, "contacts", `${contactId}`);
          const userRef = collection(db, "users");

          const userQ = query(userRef, where("email", "==", `${user?.email}`));
          onSnapshot(userQ, (querySnapshot) => {
            setNickname(querySnapshot.docs[0].data().username)
            
          })

          onSnapshot(contactsRef, (docSnap) => {
            if (docSnap.exists()) {
              const obj = docSnap.data();
              obj.id = docSnap.id;
              setContact(obj);
              setLoading(false);
              setList(obj.users.split(","))
            } else {
              console.log("No such document!");
            }
          })
        }
        getDocument()

    }, [user]);


    const handleClick = async () => {
      console.log(userContact)
      const timeSent = (new Date()).toString();
      const currentMessageArray:Message[] = (userContact.messages)
      currentMessageArray.push({timeDelivered:timeSent,text:inputText,user:nickname});
      
      const contactsRef = doc(db, "contacts", `${contactId}`);

      await updateDoc(contactsRef, {
        messages: currentMessageArray
      });
      setText("");
    }


    return (
      <div>
        { !isLoading ?
        <div className="single-room-grid">
          <div className="sidebar diagonal-lines">
            <h3>User list:</h3>
              <p>{friendList[0]}</p>
              <p>{friendList[1]}</p>
          </div>
          <div className="message-box triangle-dots">
            <h2>Chat</h2>
            {userContact.messages.map((message:Message,index:number)=>{
              return(
                <div key={index} className="message">
                  <p><b>{message.user}</b> : {message.text} <span className="time-sent">{`${new Date(message.timeDelivered).getHours()}:${new Date(message.timeDelivered).getMinutes()}`}</span></p>
                </div>
              )
            })}
            <form className="message-form">
              <input onChange={(e)=>{setText(e.target.value)}} value={inputText} className="dark-input" type="text" />
              <button onClick={handleClick} className="dark-btn" type="button">Send</button>
            </form>
          </div>
        </div>
        :
        <div></div>
        }
      </div>
    )
}

