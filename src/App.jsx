import React, { useState } from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
// import { DatePicker } from 'antd';
// import { useAuth0 } from '@auth0/auth0-react';
import routes from './constants/routes';
import MainPage from './pages/home/MainPage';
import AuthPage from './pages/authentication/AuthPage';
import PrivateRoute from './components/PrivateRoute';

// const Tasks = <h1>TASKS</h1>;
const App = () => {
  // const { isAuthenticated } = useAuth0();
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(localStorage.getItem('isAuthenticated'));
  // console.log('isAuthenticated', isAuthenticated);
  return (
    <Switch>
      <Route
        path={routes.AUTHENTICATION}
        exact
        component={() => <AuthPage setIsAuthenticatedState={setIsAuthenticatedState} />}
        // setIsAuthenticatedState={setIsAuthenticatedState}
      />
      <PrivateRoute
        path={routes.LANDING}
        exact
        component={() => <MainPage setIsAuthenticatedState={setIsAuthenticatedState} />}
        isAuthenticatedState={isAuthenticatedState}
        // setIsAuthenticatedState={setIsAuthenticatedState}
      />
      <PrivateRoute
        path={routes.TEAM}
        exact
        component={() => <h1>Dream Team</h1>}
        isAuthenticatedState={isAuthenticatedState}
      />
      {/* <Route path={routes.MAINPAGE} exact>
      <h1>MAINPAGE</h1>
    </Route> */}

      <PrivateRoute
        path={routes.TASKS}
        exact
        component={() => <h1>TASKS</h1>}
        isAuthenticatedState={isAuthenticatedState}
      />
      <PrivateRoute
        path={routes.REVIEWS}
        exact
        component={() => <h1>REVIEWS</h1>}
        isAuthenticatedState={isAuthenticatedState}
      />
      <PrivateRoute
        path={routes.REQUESTS}
        exact
        component={() => <h1>REQUESTS</h1>}
        isAuthenticatedState={isAuthenticatedState}
      />
      <Route>
        <Redirect to={routes.LANDING} />
      </Route>
    </Switch>
  );
};

export default App;
