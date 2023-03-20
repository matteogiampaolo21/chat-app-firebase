
import './App.css'
import {useAuthState} from "react-firebase-hooks/auth"
import { Navbar } from "./components/navbar"
import { AuthLogin } from './components/authLogin'
import { AuthRegister } from './components/authRegister'
import { Dashboard } from './components/dashboard'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { auth } from './config/firebase'

function App() {
  
  const [user] = useAuthState(auth);

  return (
    // <div className="App">
    //   <Navbar/>
    //   { user ? <Dasboard/>  : <AuthSignIn/> }
    // </div>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/register' element={<AuthRegister/>}/>
        <Route path='/login' element={<AuthLogin/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App
