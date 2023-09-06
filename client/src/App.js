import React, { useContext } from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import Chat from './pages/Chat.js'
import Register from './pages/Register'
import Login from './pages/Login'
import "bootstrap/dist/css/bootstrap.min.css"
import {Container} from "react-bootstrap"
import NavBar from './components/NavBar.js'
import { AuthContext } from './context/AuthContext.js'
import { ChatContextProvider } from './context/ChatContext.js'

const App = () => {
  const {user} = useContext(AuthContext)
  return (
    <ChatContextProvider user={user}>
    <NavBar/>
    <Container className=''>
        <Routes>
            <Route path="/" element={user ? <Chat/> : <Login/>}/>
            <Route path="/register" element={user ? <Chat/> : <Register/>}/>
            <Route path="/login" element={user ? <Chat/> : <Login/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>

        </Routes>
    </Container>
    </ChatContextProvider>
  )
}

export default App;
