import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { DocumentData, doc,addDoc, serverTimestamp, onSnapshot, collection, where, query,limit, orderBy} from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate, Navigate} from "react-router-dom"
import { Message } from "../assets/utilities";
import "../styles/rooms.css"

export const Contact = () => {
    const [user] = useAuthState(auth);
    const [contactsRoom, setContact] = useState<DocumentData>({})
    const [contactMessages, setMessages] = useState<Message[]>([])
    const [isLoading, setLoading] = useState<boolean>(true)
    const [inputText, setText] = useState<string>("");
    const [friendList, setList] = useState<string[]>([])

    const [nickname,setNickname] = useState<string>("")
    
    const navigate = useNavigate();
    let { contactId } = useParams();

    useEffect(() => {
        const getDocument = async () => {

          const contactsRef = doc(db, "contacts", `${contactId}`);
          const userRef = collection(db, "users");
          const messageRef = collection(db, "messages")

          const userQ = query(userRef, where("email", "==", `${user?.email}`));
          onSnapshot(userQ, (querySnapshot) => {
            setNickname(querySnapshot.docs[0].data().username)
            
          })


          const messageQ = query(messageRef,where("locationID","==", `${contactId}`), limit(30),orderBy("firebaseCreatedAt"))
          
          onSnapshot(messageQ, (querySnapshot) => {
            let tempArray:Message[] = [];
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
        
              const obj:DocumentData = doc.data();
              const messageObj:Message = {
                id:doc.id,
                createdAt: obj.createdAt,
                location: obj.location,
                locationID:obj.locationID,
                message: obj.message,
                user: obj.user,
                firebaseCreatedAt: obj.firebaseCreatedAt
              }
              tempArray.push(messageObj)
              setMessages(tempArray)
  
            });
          })

          onSnapshot(contactsRef, (docSnap) => {
            if (docSnap.exists()) {
              
              const obj = docSnap.data();
              obj.id = docSnap.id
              setContact(obj);
              setLoading(false)
              setList(obj.users.split(","))
              
            } else {
              console.log("No such document!");
            }
            
          })
        }
        getDocument()

    }, [user]);


    const handleClick = async (e:FormEvent) => {
      e.preventDefault()
    
      const timeSent = (new Date()).toString();

      await addDoc(collection(db, "messages"), {
        createdAt: timeSent,
        location: "contact",
        locationID:contactsRoom.id,
        message: inputText,
        user: nickname,
        firebaseCreatedAt: serverTimestamp(),
      });

      setText("");
    }


    return (
      <div>
        { !isLoading ?
        <div>
          {(user && contactsRoom.users.includes(user.email)) ?
          <div className="single-room-grid">
            <div className="sidebar diagonal-lines">
              <h2>User list:</h2>
                <p>{friendList[0]}</p>
                <p>{friendList[1]}</p>
            </div>
            <div className="message-box triangle-dots">
              <h2>Chat</h2>
              <div>
                {contactMessages.map((messages:Message,index:number)=>{
                  return(
                    <div key={index} className="message">
                      <p><b>{messages.user}</b> : {messages.message} <span className="time-sent">{`${new Date(messages.createdAt).getHours()}:${new Date(messages.createdAt).getMinutes()}`}</span></p>
                    </div>
                  )
                })}
                <form className="message-form">
                  <input onChange={(e)=>{setText(e.target.value)}} value={inputText} className="dark-input" type="text" />
                  <button onClick={(e) => {handleClick(e)}} className="dark-btn" type="submit">Send</button>
                </form>
              </div>
            </div>
          </div>
          : <Navigate replace to="/dashboard" /> }
        </div>
        :
        <div></div>
        }
      </div>
    )
}

