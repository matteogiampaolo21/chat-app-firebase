
import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {addDoc, query, where, onSnapshot ,collection , DocumentData,updateDoc, or, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Room, User, FriendRequest } from "../assets/utilities";

// import { ContactList } from "../components/contactList";
const ContactList = React.lazy(() => import("../components/contactList"))

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
        setName("")
        await addDoc(collection(db, "rooms"), {
            name: roomName,
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
            const friendDoc = querySnapshot.docs[0]
            
            if (userAccount.friendsArray.includes(friendDoc.data().email)){
                setFriendName("");
                alert("User is already friends with you.")
            }else{
                const userFriendReq = (friendDoc.data().friendRequest);
                userFriendReq.push({email:user?.email,id:userAccount.id})
                        
                const friendRef = doc(db, "users", friendDoc.id);
                        
                await updateDoc(friendRef, {
                    friendRequest: userFriendReq
                });

                setFriendName("");
                alert("Friend request sent.")
            }
        }
    
    }

    const acceptRequest = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const currentEvent = JSON.parse(e.currentTarget.value)
        
        
        
        // update user that sent friend request
        const otherUserRef = doc(db,"users", currentEvent.id)
        const docSnap = await getDoc(otherUserRef);
        if (!docSnap.exists()){return ("error")}
        const otherUserData:DocumentData = docSnap.data();
        const otherFriendArray:string[] = (otherUserData.friendsArray)
        otherFriendArray.push(userAccount.email);

        await updateDoc(otherUserRef, {
            friendsArray: otherFriendArray,

        });


        
        const userRef = doc(db, "users", userAccount.id);

        const currentFriendArray:string[] = (userAccount.friendsArray);
        let currentRequestArray:FriendRequest[] = (userAccount.friendRequest);
        currentFriendArray.push(currentEvent.email);
        currentRequestArray = currentRequestArray.filter((word) => {word.email !== currentEvent.email});
        await updateDoc(userRef, {
          friendsArray: currentFriendArray,
          friendRequest: currentRequestArray
        });



        const contactsRef = collection(db, "contacts");
        const contactQ = query(contactsRef, or(
            where("users", "==", `${user?.email},${currentEvent.email}`),
            where("users", "==", `${currentEvent.email},${user?.email}`)
        )
        );
        const querySnapshot = await getDocs(contactQ);
        console.log(querySnapshot.size)
        if ( querySnapshot.size === 0){
            await addDoc(collection(db, "contacts"), {
                users:`${userAccount.email},${otherUserData.email}`
            });
        }else{
            console.log("yo")
        }
        
        
    }
    const declineRequest = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const currentEvent = JSON.parse(e.currentTarget.value)
        const userRef = doc(db, "users", userAccount.id);

        let currentRequestArray:FriendRequest[] = (userAccount.friendRequest);
            
        currentRequestArray = currentRequestArray.filter((word) => {word.email !== currentEvent.email});

        await updateDoc(userRef, {
          friendRequest: currentRequestArray
        });
        
    }


    return (
        <div>
        {isLoading ?
        <div></div>
        :
        <div>
            { user ?
                <div className="dasboard-grid">

                    <div className="left-widget widget">
                        <div className="create-room-widget sub-widget diagonal-lines">
                            <h2>Create room:</h2>
                            
                            <input onChange={(e)=>{setName(e.target.value)}} value={roomName} className="dark-input" type="text" placeholder="Enter name" />
                            <button onClick={createRoom} type="submit" className="dark-btn">+</button>
                        </div>
                        <div className="friend-requests-widget sub-widget diagonal-lines">
                            <h2>Friend Requests :</h2>
                            {userAccount.friendRequest.length === 0 ?
                            <div>you have no one.</div> 
                            :
                            userAccount.friendRequest.map((person:FriendRequest,index:number)=>{
                                return(
                                    <div key={index}>
                                        {person.email}
                                        <button onClick={(e) => {acceptRequest(e)}} value={JSON.stringify(person)} className="btn green-hover">Y</button>
                                        <button onClick={(e) => {declineRequest(e)}} value={JSON.stringify(person)} className="btn red-hover">N</button>
                                    </div>
                                )
                            })
                            }    
                    
                        </div>
                    </div>


                    <div className="room-widget widget">
                        {userRooms.map( (doc:Room,index:number) => {
                            return(
                                <div onClick={() => {navigate(`/dashboard/rooms/${doc.id}`)}} key={index} className="sub-widget  triangle-dots">
                                    <h2 className="room-title hyphens">{doc.name}</h2>
                                    <p>{doc.users.length} users in this room.</p>
                                </div>
                            )
                        })}
                    </div>


                    <div className="right-widget widget">
                        <div className="friends-widget sub-widget diagonal-lines">
                            <h2>Friends:</h2>
                            
                            
                            <ContactList/>
                        </div>
                        
                    </div>
                    
                </div>
            :
                <div>
                </div>
            }
        </div>
        }
        </div>
    )

}