import { useEffect, useState} from "react";
import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {query, where, onSnapshot ,collection , DocumentData, or, updateDoc, doc} from "firebase/firestore";
import { User } from "../assets/types";
import {useNavigate} from "react-router-dom"
import { async } from "@firebase/util";


export const ContactList = () => {

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

  const handleClick = async (friend:string) => {
    
    const contactsRef = collection(db, "contacts");
    const contactQ = query(contactsRef, or(
      where("users", "==", `${user?.email},${friend}`),
      where("users", "==", `${friend},${user?.email}`)
    )
    );

    onSnapshot(contactQ, (querySnapshot) => {
      navigate(`/contacts/${querySnapshot.docs[0].id}`)
      
    })
  
  
  }
  const removeFriend = async (friend:string) => {
    let currentFriendsArray = userAccount.friendsArray;
    currentFriendsArray = currentFriendsArray.filter((word) => {word !== friend});
    
    const contactsRef = doc(db, "users", `${userAccount.id}`);

    await updateDoc(contactsRef, {
      friendsArray: currentFriendsArray
    });
        
  }

  return (
    <div className="contacts-list">
      
      {userAccount.friendsArray.map((friend:string,index:number) => {
        return(
          <div key={index} className="flex-row">
            <div onClick={()=>{handleClick(friend)}} className="friend">
              <p>{friend}</p>
            </div>
            <button onClick={()=>{removeFriend(friend)}} style={{fontSize: "1rem"}} className="dark-btn red-hover ml-5">Remove</button>
          </div>
        )
      })}
    </div>
  )
}

export default ContactList;

