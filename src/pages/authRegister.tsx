import { useState } from "react";
import {auth, db, googleProvider} from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {addDoc, collection, query, where,getDocs} from "firebase/firestore"
import {useNavigate} from "react-router-dom";
import "../styles/registerLogin.css"

export const AuthRegister = () => {
    const [inputEmail,setEmail] = useState<string>("");
    const [inputUsername, setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("")
    
    const navigate = useNavigate();

    const signIn = async () => {
        try{
            await createUserWithEmailAndPassword(auth,inputEmail,password)
            await addDoc(collection(db, "users"), {
                username: inputUsername,
                email: inputEmail,
                friendRequest: [],
                friendsArray: []
            });
            navigate("/dashboard")
        } catch(err){
            console.error(err)
        }
    }
    const signInWithGoogle = async () => {
        
        try{
            const result = await signInWithPopup(auth,googleProvider);
            const user = result.user;
            const userRef = collection(db,"users")
            const q = query(userRef, where("email", "==" , user.email))
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length === 0){
                await addDoc(collection(db, "users"), {
                    username: user.displayName,
                    email: user.email,
                    friendsArray: []
                });
                navigate("/dashboard")
            }else{
                navigate("/dashboard")
            }
            
           
            
        } catch(err){
            console.error(err)
        }
    }

       

    return (

        <div className="sign-in diagonal-lines">
            <h1 style={{textAlign:"center"}}>Register</h1>

            <h3 className="m0">Email:</h3>
            <input className="dark-input" onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input>
            
            <h3 className="m0">Password:</h3>
            <input className="dark-input" onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"></input>
            
            <h3 className="m0">Username:</h3>
            <input className="dark-input" onChange={(event) => {setUsername(event.target.value)}} type="text" placeholder="Username"></input> 
            
            <button className="dark-btn max-width green-hover" onClick={signIn}>Sign Up!</button>
            <button className="dark-btn max-width" onClick={signInWithGoogle}>Sign in with Google</button>
            


            <h4 className="mt-5 mb-5" style={{textAlign:"center"}}>Or</h4> 
            
            <button className="dark-btn max-width purple-hover" onClick={() => {navigate("/login")}}>Already have an account?</button>
        </div>
    )

}