import { useState } from "react";
import {auth, googleProvider} from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {useNavigate} from "react-router-dom";

export const AuthRegister = () => {
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("")
    
    const navigate = useNavigate();

    const signIn = async () => {
        try{
            await createUserWithEmailAndPassword(auth,email,password)
            navigate("/dashboard")
        } catch(err){
            console.error(err)
        }
    }
    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth,googleProvider)
            navigate("/dashboard")
        } catch(err){
            console.error(err)
        }
    }

       

    return (

        <div className="sign-in">
            <input onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input><br /><br />
            <input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"></input><br /><br />  
            <button className="btn" onClick={signIn}>Sign Up!</button>
            <button className="btn" onClick={signInWithGoogle}>Sign in with Google</button> <br /><br />
            <button className="btn" onClick={() => {navigate("/login")}}>Already have an account?</button>
        </div>
    )

}