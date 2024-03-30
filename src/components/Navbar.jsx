import React, { useState} from "react";
import { Link } from "react-router-dom";
import '../CSS/navbar.css';

const Navbar = ({operatingData }) => {

  const [isLoggedIn] = useState(() => {
    return operatingData.idUser !== 0 && operatingData.idUser !== undefined;
  });

  return (
    <nav>
      <div className="logo">
        {isLoggedIn ? (
          <Link to="/home">Quest</Link>
        ) : (
          <Link to="/">Quest</Link>
        )}
      </div>
      <ul className="nav-links" >
            <li>
              <Link to="/rules">Rules</Link>
            </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/sign_in">Sign In</Link>
            </li>
            <li>
              <Link to="/sign_up">Sign Up</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/user">User</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;