import { signOut} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import "../styles/navbar.css"


export const Navbar = () => {
  const navigate = useNavigate(); 
  const [user] = useAuthState(auth);
  const [cssStyle, setStyle] = useState<string>("hidden")
  const [smallNavbar, setNavbar] = useState<boolean>(false)
  
  const logOut = async () => {
    try{
        await signOut(auth)
        navigate("/login")

    } catch(err){
        console.error(err)
    }
  }
  function checkSmallNavbarStyle() {
    if (cssStyle === "hidden"){
      setStyle("")
    }else{
      setStyle("hidden")
    }
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 965){
        setNavbar(true)
      }else{
        setNavbar(false)
      } 
    }
    window.addEventListener('resize', handleResize) 
  });

  return (
    <div>
    { smallNavbar ?
      <nav className="navbar diagonal-lines">
        <ul className="navbar-nav">
          <li className="brand" style={{display: "flex"}}><h1>Mercury</h1><button onClick={checkSmallNavbarStyle} className="nav-btn">=</button></li>
          
          <li className={`nav-item ${cssStyle}`}><a className="nav-link" href="/dashboard">Dashboard</a></li>
          <li className={`nav-item ${cssStyle}`}><a className="nav-link" href="/profile">Profile</a></li>
          <li className={`nav-item ${cssStyle}`}><a className="nav-link" href="/register">Register</a></li>
          <li className={`nav-item ${cssStyle}`}><a className="nav-link" href="/login">Login</a></li>
          <li className={`nav-item ${cssStyle}`}><button className="dark-btn ml-5 mr-5" onClick={logOut}>Sign Out</button></li>
        </ul>
      </nav>
    :
    <nav className="navbar diagonal-lines">
      <ul className="navbar-nav">
        <li className="brand"><h1>Mercury</h1></li>
        
        <li className="nav-item"><a className="nav-link" href="/dashboard">Dashboard</a></li>
        <li className="nav-item"><a className="nav-link" href="/profile">Profile</a></li>
        <li className="nav-item"><a className="nav-link" href="/register">Register</a></li>
        <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
        <li className="nav-item"><button className=" dark-btn ml-5 mr-5" onClick={logOut}>Sign Out</button></li>
      </ul>
    </nav>
  }
  </div>
    
  )
}

