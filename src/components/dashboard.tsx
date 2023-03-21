
import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { collection , DocumentData, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Room } from "../assets/types";

export const Dashboard = () => {

    const [user] = useAuthState(auth);
    const [userRooms,setRooms] = useState<DocumentData>([]);
    const [isLoading, setLoading] = useState<boolean>(true)
    
    const navigate = useNavigate();
    useEffect(() => {
        const readDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "rooms"));
            let tempArray:DocumentData = []
            querySnapshot.forEach((doc) => {
                const obj = doc.data();
                obj.id = doc.id;
                tempArray.push(obj);
            });
            setRooms(tempArray)
            setLoading(false)
            
        }
        readDocuments()

    }, []);

    return (
        <div>
        {isLoading ?
        <div></div>
        :
        <div>
            { user ?
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