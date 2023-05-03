import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { DocumentData, doc,getDocs, updateDoc, onSnapshot, query, where, collection, addDoc, serverTimestamp, orderBy, limit, QuerySnapshot} from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams, Navigate} from "react-router-dom"
import { Message } from "../assets/utilities";
import "../styles/rooms.css"

export const Rooms = () => {


    const [user] = useAuthState(auth);
    const [userRoom, setRoom] = useState<DocumentData>({})
    const [roomMessages, setMessages] = useState<Message[]>([])
    const [isLoading, setLoading] = useState<boolean>(true)
    const [inputText, setText] = useState<string>("")
    const [newUser, setNewUser] = useState<string>("")

    const [nickname,setNickname] = useState<string>("")

    const navigate = useNavigate();
    
    let { roomId } = useParams();

    useEffect(() => {
        const getDocument = async () => {

          const roomRef = doc(db, "rooms", `${roomId}`);
          const userRef = collection(db, "users");
          const messageRef = collection(db, "messages")

          const userQ = query(userRef, where("email", "==", `${user?.email}`));

          onSnapshot(userQ, (querySnapshot) => {
            setNickname(querySnapshot.docs[0].data().username)
            
          })

          const messageQ = query(messageRef,where("locationID","==", `${roomId}`), limit(30),orderBy("firebaseCreatedAt"))
          
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
          


          onSnapshot(roomRef, (docSnap) => {
            if (docSnap.exists()) {
              
                const obj = docSnap.data();
                obj.id = docSnap.id;
                setRoom(obj);
                setLoading(false)
             
              
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
        location: "room",
        locationID:userRoom.id,
        message: inputText,
        user: nickname,
        firebaseCreatedAt: serverTimestamp(),
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

    const removeUser = async (userEmail:string) => {
      
      
      const roomRef = doc(db, "rooms", `${roomId}`);

      let currentUserArray:string[] = (userRoom.users);
      
      currentUserArray = currentUserArray.filter(word => word !== userEmail);
      
      await updateDoc(roomRef, {
        users: currentUserArray
      });
    }

    

    return (
      <div>
        { !isLoading ?
        <div>

          { (user && userRoom.users.includes(user.email)) ?
            <div className="single-room-grid">


              <div className="sidebar diagonal-lines">

                
                <div className="add-user-box ">
                  <input onChange={(e)=>{setNewUser(e.target.value)}} value={newUser} className="dark-input" placeholder="Add user"></input>
                  <button onClick={handleAddUser} className="dark-btn green-hover">+</button>
                </div>

                <h3>User list:</h3>
                {userRoom.users.map((user:string,index:number)=>{
                  return(
                    <div className="user-list-container">
                      <p key={index}>{user}</p>
                      <button onClick={() => {removeUser(user)}} className="btn red-hover">Kick</button>
                    </div>
                  )
                })}     
                                  
              </div>


              <div className="message-box triangle-dots">
                <h2>{userRoom.name}</h2>
                <div>
                {roomMessages.map((messages:Message,index:number)=>{
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

