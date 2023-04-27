import { signOut} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import { useState } from "react";
import "../styles/navbar.css"


export const Navbar = () => {
  const navigate = useNavigate(); 
  const [user] = useAuthState(auth);
  const [cssStyle, setStyle] = useState<string>("hidden")

  const logOut = async () => {
    try{
        await signOut(auth)
        navigate("/login")

    } catch(err){
        console.error(err)
    }
  }
  function checkDimensions() {
    const { innerWidth: width} = window;
    console.log(width)
  }

  return (
    
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="brand" style={{display: "flex"}}><h1>Mercury</h1><button onClick={checkDimensions} className="dark-btn nav-btn">V</button></li>
        
        <li className="nav-item"><a className={`nav-link ${cssStyle}`} href="/dashboard">Dashboard</a></li>
        <li className="nav-item"><a className="nav-link" href="/profile">Profile</a></li>
        <li className="nav-item"><a className="nav-link" href="/register">Register</a></li>
        <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
        <li className="nav-item"><button className="dark-btn ml-5 mr-5" onClick={logOut}>Sign Out</button></li>
      </ul>
    </nav>
  )
}

