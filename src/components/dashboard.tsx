
import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {addDoc, query, where, onSnapshot ,collection , DocumentData,updateDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Room, User } from "../assets/types";

import "../styles/dashboard.css"
export const Dashboard = () => {

    const [user] = useAuthState(auth);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [userRooms,setRooms] = useState<DocumentData>([]);
    const [friendName, setFriendName] = useState<string>("")

    const [userAccount,setUserAccount] = useState<User>({
        id:"",
        email:"",
        friendsArray:[],
        friendRequest:[],
        username:""
    })

    const [roomName, setName] = useState<string>("");
    
    
    const navigate = useNavigate();
    useEffect(() => {
        
        const readDocuments = async () => {
            
            const roomsRef = collection(db, "rooms");
            const usersRef = collection(db, "users");

            const roomQ = query(roomsRef, where("users", "array-contains", `${user?.email}`));
            const userQ = query(usersRef, where("email", "==", `${user?.email}`));
            
            onSnapshot(roomQ, (querySnapshot) => {
                const rooms:DocumentData = []
                querySnapshot.forEach((doc) => {
                    const obj = doc.data();
                    obj.id = doc.id;
                    rooms.push(obj);
                });
                setRooms(rooms)
            })
            onSnapshot(userQ, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const obj:DocumentData = doc.data();
                    const myUser:User = {id:doc.id,email:obj.email,friendsArray:obj.friendsArray,friendRequest:obj.friendRequest,username:obj.username}
                    setUserAccount(myUser)
                });
                
            })
            setLoading(false)
            
            
            
        }
        readDocuments()

    }, [user]);
    
    
    const createRoom = async () => {
        await addDoc(collection(db, "rooms"), {
            name: roomName,
            messages: [],
            users: [user?.email]
        });
    }

    const handleAddFriend = async () => {

        const usersRef = collection(db, "users");
        const userQ = query(usersRef, where("email", "==", friendName));
        const querySnapshot = await getDocs(userQ);
        // console.log(querySnapshot.docs[0].data());
        // console.log(querySnapshot)

        
        if (querySnapshot.size === 0){
            alert("User could not be found")
        }else{
                
            
            const userFriendReq = (querySnapshot.docs[0].data().friendRequest);
            userFriendReq.push(user?.email)
                    
            const friendRef = doc(db, "users", querySnapshot.docs[0].id);
                    
            await updateDoc(friendRef, {
                friendRequest: userFriendReq
            });

            setFriendName("");
            alert("Friend request sent.")
        }
    
    }

    const acceptRequest = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        const userRef = doc(db, "users", userAccount.id);

        const currentFriendArray:string[] = (userAccount.friendsArray);
        let currentRequestArray:string[] = (userAccount.friendRequest);

        currentFriendArray.push(e.currentTarget.value);
        currentRequestArray = currentRequestArray.filter((word) => {word !== e.currentTarget.value});
        

        await updateDoc(userRef, {
          friendsArray: currentFriendArray,
          friendRequest: currentRequestArray
        });
        
    }
    const declineRequest = () => {
        
    }

    return (
        <div>
        {isLoading ?
        <div></div>
        :
        <div>
            { user ?
                <div className="dasboard-grid">
                    <div className="friend-sidebar">
                    <div className="dashboard-sidebar diagonal-lines">
                        <h2>Create room:</h2>
                        
                        <input onChange={(e)=>{setName(e.target.value)}} className="dark-input mr-5" type="text" placeholder="Enter name" />
                        <button onClick={createRoom} type="submit" className="blue-btn">+</button>
                    </div>
                    <div className="friend-sidebar-component diagonal-lines">
                        <h2>Friend Requests :</h2>
                        {userAccount.friendRequest.length === 0 ?
                        <div>you have no one.</div> 
                        :
                        userAccount.friendRequest.map((person:string,index:number)=>{
                            return(
                                <div key={index}>
                                    {person}
                                    <button onClick={(e) => {acceptRequest(e)}} value={person} className="btn green-hover">Y</button>
                                    <button onClick={declineRequest} className="btn red-hover">N</button>
                                </div>
                            )
                        })
                        }    
                
                    </div>
                    </div>

                    <div className="dasboard">
                        {userRooms.map( (doc:Room,index:number) => {
                            return(
                                <div onClick={() => {navigate(`/dashboard/${doc.id}`)}} key={index} className="room-container triangle-dots">
                                    <h2 className="room-title ml-5">{doc.name}</h2>
                                    <div className="user-list">
                                        <p className="ml-5"><b>Users:</b> </p>
                                        {doc.users.slice(0,4).map( (user:string, index:number) => {
                                            
                                            return(
                                                <p className="ml-5" key={index}>{user}</p>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="friend-sidebar">
                        <div className="friend-sidebar-component diagonal-lines">
                            <h2>Friends :</h2>
                            <input onChange={(e)=>{setFriendName(e.target.value)}} value={friendName} className="dark-input mr-5" type="text" placeholder="Add friend" />
                            <button onClick={handleAddFriend} type="button" className="blue-btn mb-5">+</button>
                            
                            {userAccount.friendsArray.length === 0 ?
                            <div>you have no friends.</div> 
                            :
                            <ul>
                                {userAccount.friendsArray.map((person:string,index:number)=>{
                                    return(
                                        <li key={index}><div >
                                            {person}
                                        </div></li>
                                    )
                                })}
                            </ul>
                            }
                        
                        </div>
                        
                    </div>
                    
                </div>
            :
                <div>
                    <h1>You were not signed in.</h1>
                    <button onClick={()=>{navigate("/register")}} className="btn">Register Today!</button>
                    <button onClick={()=>{navigate("/login")}} className="btn">Login here!</button>
                </div>
            }
        </div>
        }
        </div>
    )

}