import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import HomePage from './components/home/HomePage';
import AboutPage from './components/home/AboutPage';
import LoginPage from './components/home/LoginPage';
import CreateUserPage from './components/home/CreateUserPage';
import ShortenerPage from './components/home/ShortenerPage';

import './styles.css';

//import ShortPaneMain from './components/splitpanes/ShortPaneMain';

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
          <Route path="/createuser" element={<CreateUserPage />} />
          <Route path="/shortener" element={<ShortenerPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
      {/* <ShortPaneMain /> */}
    </>
  );
};

export default App;
