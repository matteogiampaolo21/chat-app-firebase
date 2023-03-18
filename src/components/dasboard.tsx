
import { auth, db } from "../config/firebase";
import { collection , DocumentData, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Room } from "../assets/types";

export const Dasboard = () => {


    const [userRooms,setRooms] = useState<DocumentData>([]);
    

    useEffect(() => {
        const readDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "rooms"));
            let tempArray:DocumentData = []
            querySnapshot.forEach((doc) => {
                tempArray.push(doc.data());
            });
            setRooms(tempArray)
            
        }
        readDocuments()

    }, []);

    return (
        <div className="dasboard">
            
            {userRooms.map( (doc:Room,index:number) => {
                return(
                    <div key={index} className="room-container">
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
    )

}