import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, where, onSnapshot ,collection , DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { User } from "../assets/types";



import { ContactList } from "../components/contactList";

import "../styles/profile.css"


export const Profile = () => {
    const [user] = useAuthState(auth);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [userAccount,setUserAccount] = useState<User>({
        id:"",
        email:"",
        friendsArray:[],
        friendRequest:[],
        username:""
    })

    const navigate = useNavigate();

    useEffect(() => {
        
        const readDocuments = async () => {
            
            const usersRef = collection(db, "users");
            const userQ = query(usersRef, where("email", "==", `${user?.email}`));
            
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
    
    

    return (
        <div>
        {isLoading ?
        <div></div>
        :
        <div>
            { user ?
                <div className="profile-card triangle-dots">
                    
                    <div className="profile-flex-item">
                        <input className="dark-input" type="text" placeholder={userAccount.username} />
                        <button className="ml-5 dark-btn">Change</button>
                    </div>
                    <div className="profile-flex-item">
                        <ContactList/>
                        <button className="ml-5 dark-btn">Remove</button>
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

