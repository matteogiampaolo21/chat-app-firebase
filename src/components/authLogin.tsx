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
            <h1 style={{textAlign:"center"}}>Login</h1>
            <h3 className="m0">Email:</h3>
            <input className="dark-input" onChange={(event) => {setEmail(event.target.value)}} placeholder="Email"></input>
            <h3 className="m0">Password:</h3>
            <input className="dark-input" onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password"></input> 
            <button className="dark-btn max-width green-hover" onClick={logIn}>Log In</button>
            <h4 className="mt-5 mb-5" style={{textAlign:"center"}}>Or</h4>
            <button className="dark-btn max-width purple-hover"  onClick={() => {navigate("/register")}}>Don't have an account?</button>
        </div>
    )
}

