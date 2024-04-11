import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Booking";
import MainNavigation from "./components/Navigation/mainNavigation";
import AuthContext from "./context/auth-context";

const App = () => {
  // state = {
  //   token: null,
  //   userId: null,
  // };
  const [log, setLog] = useState({
    token: null,
    userId: null,
  });

  const login = (token, userId, tokenExpiration) => {
    setLog({ token: token, userId: userId });
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{
            token: log.token,
            userId: log.userId,
            login: login,
            logout: () => setLog({ token: null, userId: null }),
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!log.token && <Redirect from="/" to="/auth" exact />}
              {!log.token && <Redirect from="/bookings" to="/auth" exact />}
              {log.token && <Redirect from="/" to="/events" exact />}
              {log.token && <Redirect from="/auth" to="/events" exact />}
              {!log.token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={Events} />
              {log.token && <Route path="/bookings" component={Bookings} />}
              {log.token && <Redirect from="/auth" to="/events" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
