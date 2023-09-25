
import './styles/app.css'
import { useAuthState} from "react-firebase-hooks/auth"
import { Navbar } from "./components/navbar"
import { Home } from './pages/home'
import { AuthLogin } from './pages/authLogin'
import { AuthRegister } from './pages/authRegister'
import { Dashboard } from './pages/dashboard'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { auth } from './config/firebase'
import { Rooms } from "./pages/rooms"
import { Contact } from "./pages/contact"
import { Profile } from './pages/profile'

function App() {
  
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/register' element={<AuthRegister/>}/>
        <Route path='/login' element={<AuthLogin/>}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/dashboard/rooms/:roomId' element={<Rooms/>} />
        <Route path='/contacts/:contactId' element={<Contact/>} />
      </Routes>
    </Router>
  )
}

export default App
