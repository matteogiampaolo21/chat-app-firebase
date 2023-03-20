import { useState } from "react";
import {auth} from "../config/firebase";
import {signInWithEmailAndPassword} from "firebase/auth"
import {useNavigate} from "react-router-dom"

export const AuthLogin = () => {

    const navigate = useNavigate();

    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("")

    const logIn =async () => {
        try{
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/dashboard")
        } catch(err){
            console.error(err)
        }
    }

    return (
        <div className="log-in">
            <input onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input><br /><br />
            <input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"></input><br /><br />  
            <button className="btn" onClick={logIn}>Log In</button> <br /><br />
            <button className="btn" onClick={() => {navigate("/register")}}>Don't have an account?</button>
        </div>
    )
}

