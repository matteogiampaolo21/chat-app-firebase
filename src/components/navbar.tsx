import { signOut} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";

import "../styles/navbar.css"


export const Navbar = () => {
  const navigate = useNavigate(); 
  const [user] = useAuthState(auth);

  const logOut = async () => {
    try{
        await signOut(auth)
        navigate("/login")

    } catch(err){
        console.error(err)
    }
  }

  return (
    
    <div className="navbar diagonal-lines">
      <div className="navbar-grid">
        <div className="navbar-grid">
          <h1>Mercury</h1>
          <a className="nav-link" href="/">Home</a>
          <a className="nav-link" href="/dashboard">Dashboard</a>
          <a className="nav-link" href="/profile">Profile</a>
          <a className="nav-link" href="/register">Register</a>
          <a className="nav-link" href="/login">Login</a>
        </div>
          
        <button className="dark-btn ml-5 mr-5" onClick={logOut}>Sign Out</button>
      </div>
    </div>
  )
}

