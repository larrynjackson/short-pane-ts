import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import HomePage from './components/home/HomePage';
import AboutPage from './components/home/AboutPage';
import LoginPage from './components/home/LoginPage';
import CreateUserPage from './components/home/CreateUserPage';
import AddDestinationPage from './components/home/AddDestinationPage';
import ShortenerPage from './components/home/ShortenerPage';
import EditDestinationPage from './components/home/EditDestinationPage';
import PasswordAdminPage from './components/home/PasswordAdmin';

import './components/css/shortener.css';

export function getMachineId() {
  let machineId = localStorage.getItem('MachineId');

  if (!machineId) {
    machineId = crypto.randomUUID();
    localStorage.setItem('MachineId', machineId);
  }

  return machineId;
}

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/passwordadmin" element={<PasswordAdminPage />} />
          <Route path="/createuser" element={<CreateUserPage />} />
          <Route path="/newdestination" element={<AddDestinationPage />} />
          <Route path="/editdestination" element={<EditDestinationPage />} />
          <Route path="/shortener" element={<ShortenerPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
