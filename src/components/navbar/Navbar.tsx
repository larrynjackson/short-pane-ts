import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="topnav">
      <Link to="/" className="active">
        Home
      </Link>
      <Link to="/login">Login</Link>
      <Link to="/createuser">Create User</Link>
      <Link to="/shortener">Shortener</Link>
      <Link to="/about">About</Link>
    </div>
  );
};
export default Navbar;