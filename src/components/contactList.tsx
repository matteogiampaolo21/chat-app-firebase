import { useEffect, useState} from "react";
import { auth, db } from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {query,getDocs, where, onSnapshot ,collection , DocumentData, or, updateDoc, doc} from "firebase/firestore";
import { User } from "../assets/utilities";
import {useNavigate} from "react-router-dom"
import { async } from "@firebase/util";
import { smallText } from "../assets/utilities";


export const ContactList = () => {

  const [user] = useAuthState(auth);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [friendName, setFriendName] = useState<string>("")

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


    // Delete from current user 
    let currentFriendsArray = userAccount.friendsArray;
    currentFriendsArray = currentFriendsArray.filter((word) => word !== friend);
    
    const contactsRef = doc(db, "users", `${userAccount.id}`);
    await updateDoc(contactsRef, {
      friendsArray: currentFriendsArray
    });

    //Delete from other user 
    const friendsContactRef = collection(db, "users");
    const q = query(friendsContactRef, where("email", "==", friend));
    const querySnapshot = await getDocs(q);

    let friendID:string = ""
    let updatedArr:string[] = []

    querySnapshot.forEach(async (doc) => {
      const friendsArr = (doc.data().friendsArray);
      friendID = doc.id
      updatedArr = (friendsArr.filter((word:string) => word !== user?.email));
      
    });

    const friendsRef = doc(db, "users", `${friendID}`);
    await updateDoc(friendsRef, {
      friendsArray: updatedArr
    });


    
        
  }

  const handleAddFriend = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    

    const usersRef = collection(db, "users");
    const userQ = query(usersRef, where("email", "==", friendName));
    const querySnapshot = await getDocs(userQ);
    // console.log(querySnapshot.docs[0].data());
    // console.log(querySnapshot)

    
    if (querySnapshot.size === 0){
        alert("User could not be found")
        
    }else{
        const friendDoc = querySnapshot.docs[0]
        
        
        if (friendDoc.data().friendRequest.some((x:{email:string,id:string}) => x.email === userAccount.email)){
          setFriendName("");
          alert("Already sent friend request to this person.")
          e.currentTarget.disabled = false;
        }else if (userAccount.friendsArray.includes(friendDoc.data().email)){
            setFriendName("");
            alert("User is already friends with you.")
            e.currentTarget.disabled = false;
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

  return (
    <div className="contacts-list">
      <div className="add-friends-wdgt mt-5">
        <input onChange={(e)=>{setFriendName(e.target.value)}} value={friendName} className="dark-input" type="text" placeholder="Add friend" />
        <button onClick={(e) => {handleAddFriend(e)}} type="button" className="blue-btn mb-5">+</button>
      </div>
      {userAccount.friendsArray.map((friend:string,index:number) => {
        return(
          <div>
            <div key={index} className="contacts-list-flex-row mt-5">
              
              
              <p onClick={()=>{handleClick(friend)}} className="m0 contact-friend">{smallText(friend, 26)}</p>
              
              <button onClick={()=>{removeFriend(friend)}} style={{fontSize: "1rem"}} className="dark-btn red-hover ml-5">Remove</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ContactList;

