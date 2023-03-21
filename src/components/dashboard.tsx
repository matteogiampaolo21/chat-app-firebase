
import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { query, where, doc, onSnapshot ,collection , DocumentData, getDocs, QuerySnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Room } from "../assets/types";

export const Dashboard = () => {

    const [user] = useAuthState(auth);
    const [userRooms,setRooms] = useState<DocumentData>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    
    
    const navigate = useNavigate();
    useEffect(() => {
        
        const readDocuments = async () => {
            
            const roomsRef = collection(db, "rooms");
            const q = query(roomsRef, where("users", "array-contains", `${user?.email}`));
            
            onSnapshot(q, (querySnapshot) => {
                const rooms:DocumentData = []
                querySnapshot.forEach((doc) => {
                    const obj = doc.data();
                    obj.id = doc.id;
                    rooms.push(obj);
                });
                setRooms(rooms)
            })
            setLoading(false)
            
            
            
        }
        readDocuments()

    }, [user]);

    return (
        <div>
        {isLoading ?
        <div></div>
        :
        <div>
            { user ?
                <div className="dasboard-grid">

                    <div className="sidebar">
                        <h2>Create</h2>
                        
                            Name : 
                            <input className="dark-input ml-5" type="text" />
                            <button className="success-btn">+</button>
                       
                    </div>

                    <div className="dasboard">
                        {userRooms.map( (doc:Room,index:number) => {
                            return(
                                <div onClick={() => {navigate(`/dashboard/${doc.id}`)}} key={index} className="room-container">
                                    <h2 className="ml-5">{doc.name}</h2>
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