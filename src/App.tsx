
import './App.css'
import {useAuthState} from "react-firebase-hooks/auth"
import { Navbar } from "./components/navbar"
import { AuthSignIn } from './components/auth'
import { Dasboard } from './components/dasboard'
import { auth } from './config/firebase'

function App() {
  
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Navbar/>
      { user ? <Dasboard/>  : <AuthSignIn/> }
    </div>
  )
}

export default App
