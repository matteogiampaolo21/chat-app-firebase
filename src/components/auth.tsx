import { useState } from "react";
import {auth, googleProvider} from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword} from "firebase/auth"

export const AuthSignIn = () => {
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("")
    const [registered,setRegister] = useState<boolean>(false)

    const signIn = async () => {
        try{
            await createUserWithEmailAndPassword(auth,email,password)
        } catch(err){
            console.error(err)
        }
    }
    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth,googleProvider)
        } catch(err){
            console.error(err)
        }
    }

    const logIn =async () => {
        try{
            await signInWithEmailAndPassword(auth,email,password)
        } catch(err){
            console.error(err)
        }
    }
    
    
   

    return (
        <div>
            {registered ?

            <div className="log-in">
                <input onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input><br /><br />
                <input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"></input><br /><br />  
                <button onClick={logIn}>Log In</button> <br /><br />
                <button onClick={() => {setRegister(false)}}>Don't have an account?</button>
            </div>
            
            :

            <div className="sign-in">
                <input onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input><br /><br />
                <input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"></input><br /><br />  
                <button onClick={signIn}>Sign Up!</button>
                <button onClick={signInWithGoogle}>Sign in with Google</button> <br /><br />
                <button onClick={() => {setRegister(true)}}>Already have an account?</button>
            </div>

            }
        </div>
    )

}