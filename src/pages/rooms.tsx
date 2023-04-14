import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { DocumentData, doc, updateDoc, onSnapshot, query, where, collection,getDocs} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom"
import { Message } from "../assets/types";
import "../styles/rooms.css"

export const Rooms = () => {


    const [user] = useAuthState(auth);
    const [userRoom, setRoom] = useState<DocumentData>({})
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

          const userQ = query(userRef, where("email", "==", `${user?.email}`));
          onSnapshot(userQ, (querySnapshot) => {
            setNickname(querySnapshot.docs[0].data().username)
            
          })

          onSnapshot(roomRef, (docSnap) => {
            if (docSnap.exists()) {
              if (user && docSnap.data().users.includes(user.email)){
                const obj = docSnap.data();
                obj.id = docSnap.id;
                setRoom(obj);
                setLoading(false)
              }else{
                
                navigate("/dashboard")
                alert("You do not have access to this room");
                
              }
              
            } else {
              console.log("No such document!");
            }
          })


        }
        getDocument()

    }, [user]);

    const handleClick = async () => {
      

      const timeSent = (new Date()).toString();
      const currentMessageArray:Message[] = (userRoom.messages)
      currentMessageArray.push({timeDelivered:timeSent,text:inputText,user:nickname});
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
    const removeUser = async (userEmail:string) => {
      
      
      const roomRef = doc(db, "rooms", `${roomId}`);

      let currentUserArray:string[] = (userRoom.users);
      
      currentUserArray = currentUserArray.filter(word => word !== userEmail);
      
      await updateDoc(roomRef, {
        users: currentUserArray
      });
    }

    const checkAuth = () => {
      if (user && userRoom.users.includes(user.email)){
        return true
      }
      else{
        return false
      }
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
            
            {userRoom.users.map((user:string,index:number)=>{
              return(
                
                  <p>{user}<button onClick={() => {removeUser(user)}} className="btn ml-5 red-hover">-</button></p>
                  
                
              )
            })}
            
            
          </div>
          <div className="message-box triangle-dots">
            <h2>Chat</h2>
            {userRoom.messages.slice(-25).map((message:Message,index:number)=>{
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

