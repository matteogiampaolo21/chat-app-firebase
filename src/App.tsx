
import './styles/app.css'
import { useAuthState} from "react-firebase-hooks/auth"
import { Navbar } from "./components/navbar"
import { AuthLogin } from './components/authLogin'
import { AuthRegister } from './components/authRegister'
import { Dashboard } from './components/dashboard'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { auth } from './config/firebase'
import { Rooms } from "./components/rooms"

function App() {
  
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/register' element={<AuthRegister/>}/>
        <Route path='/login' element={<AuthLogin/>}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/dashboard/:roomId' element={<Rooms/>} />
      </Routes>
    </Router>
  )
}

export default App
