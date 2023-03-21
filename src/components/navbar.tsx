import { signOut} from "firebase/auth";
import { auth } from "../config/firebase";


export const Navbar = () => {

  const logOut = async () => {
    try{
        await signOut(auth)
    } catch(err){
        console.error(err)
    }
  }

  return (
    <div className="navbar">
        <div className="navbar-grid">
          <div className="navbar-grid">
          <h1>Mercury</h1>
          <a className="nav-link" href="/dashboard">Dashboard</a>
          <a className="nav-link" href="/register">Register</a>
          <a className="nav-link" href="/login">Login</a>
          </div>
          <button className="dark-btn ml-5 mr-5" onClick={logOut}>Sign Out</button>
          
        </div>
    </div>
  )
}

