import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "../Navigation/mainNavigation.css";
import AuthContext from "../../context/auth-context";

const MainNavigation = (props) => {
  const context = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1> Easy event</h1>
      </div>
      <nav className="main-navigation__item">
        <ul>
          {!context.token && (
            <li>
              <NavLink to="/auth">Auth</NavLink>
            </li>
          )}

          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {context.token && (
            <React.Fragment>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={context.logout}>Log out</button>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
