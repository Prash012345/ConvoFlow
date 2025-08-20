import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login'; 
import Register from './register';
import Chat from "./components/Chat";
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
