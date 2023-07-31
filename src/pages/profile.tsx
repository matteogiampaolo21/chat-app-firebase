import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, where, onSnapshot ,collection , DocumentData, updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { User } from "../assets/utilities";



import { ContactList } from "../components/contactList";

import "../styles/profile.css"


export const Profile = () => {
    const [user] = useAuthState(auth);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [newUsername, setUsername] = useState<string>("")

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

    const handleNameChange = async () =>{
      
      const contactsRef = doc(db, "users", `${userAccount.id}`);

      await updateDoc(contactsRef, {
        username: newUsername
      });
      setUsername("");
    }

    
    
    

    return (
        <div>
            { user ?
                <div className="profile-card triangle-dots">
                    
                    <div className="profile-flex-item username-form">
                        <h1>Change Username:</h1>
                        
                        <input onChange={(e)=>{setUsername(e.target.value)}} value={newUsername} className="dark-input" type="text" placeholder={userAccount.username} />
                        <button onClick={handleNameChange} className=" dark-btn">Change</button>
                        
                    </div>
                    <div className="profile-flex-item">
                        <h1 className="m0">Friends List:</h1>
                        <div>
                            <ContactList/>
                        </div>
                    </div>
                    
                </div>
            :
                <LoadingPage/>
            }
        </div>
    )

}

const LoadingPage = () =>{
    const [isError, setError] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(true)
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
           {isError ? 
                <div className="error-text">Please login or register to access the dashboard.</div>
           : 
                <div className="loader">

                </div>
           } 
        </div>
    )
}

