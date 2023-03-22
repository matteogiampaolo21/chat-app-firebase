import { useState } from "react";
import {auth, googleProvider} from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import "../styles/registerLogin.css"

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
            <h1 style={{textAlign:"center"}}>Register</h1>
            <h3 className="m0">Email:</h3>
            <input className="dark-input" onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input>
            <h3 className="m0">Password:</h3>
            <input className="dark-input" onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"></input>
            <button className="dark-btn max-width green-hover" onClick={signIn}>Sign Up!</button>
            <button className="dark-btn max-width" onClick={signInWithGoogle}>Sign in with Google</button>
            <h4 className="mt-5 mb-5" style={{textAlign:"center"}}>Or</h4> 
            <button className="dark-btn max-width purple-hover" onClick={() => {navigate("/login")}}>Already have an account?</button>
        </div>
    )

}