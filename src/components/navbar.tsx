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
          <h1>Mercury</h1>
          <button onClick={logOut}>Log Out</button>
        </div>
    </div>
  )
}

