import React, { useState } from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import routes from './constants/routes';
import MainPage from './pages/home/MainPage';
import AuthPage from './pages/authentication/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import EditCheckingList from './pages/edit/EditCheckingList';
import ReviewsPage from './pages/reviews/ReviewsPage';
import RequestsPage from './pages/reviewRequests/RequestsPage';

const App = () => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(localStorage.getItem('isAuthenticated'));
  const [user] = useState(localStorage.getItem('user'));
  const [role, setRole] = useState(localStorage.getItem('role') || 'author');

  return (
    <Switch>
      <Route
        path={routes.AUTHENTICATION}
        exact
        component={() => (
          <AuthPage
            setIsAuthenticatedState={setIsAuthenticatedState}
            setRole={setRole}
            role={role}
          />
        )}
        // setIsAuthenticatedState={setIsAuthenticatedState}
      />
      <PrivateRoute
        path={routes.LANDING}
        exact
        component={() => <MainPage setIsAuthenticatedState={setIsAuthenticatedState} role={role} />}
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
        component={() => (
          <EditCheckingList
            setIsAuthenticatedState={setIsAuthenticatedState}
            role={role}
          />
        )}

        isAuthenticatedState={isAuthenticatedState}
      />
      <PrivateRoute
        path={routes.REVIEWS}
        exact
        isAuthenticatedState={isAuthenticatedState}
      >
        <ReviewsPage />
      </PrivateRoute>
      <PrivateRoute
        path={routes.REQUESTS}
        exact
        component={() => <RequestsPage user={user} />}
        isAuthenticatedState={isAuthenticatedState}
      />
      <Route>
        <Redirect to={routes.LANDING} />
      </Route>
    </Switch>
  );
};

export default App;
