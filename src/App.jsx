import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
// import { DatePicker } from 'antd';
import routes from './constants/routes';
import MainPage from './pages/home/MainPage';
import AuthPage from './pages/authentication/AuthPage';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Switch>
    <Route path={routes.AUTHENTICATION} exact>
      <AuthPage />
    </Route>
    <PrivateRoute path={routes.LANDING} exact>
      <MainPage />
    </PrivateRoute>
    <Route path={routes.TEAM} exact>
      <h1>Dream Team</h1>
    </Route>
    {/* <Route path={routes.MAINPAGE} exact>
      <h1>MAINPAGE</h1>
    </Route> */}

    <PrivateRoute path={routes.TASKS} exact>
      <h1>TASKS</h1>
    </PrivateRoute>
    <PrivateRoute path={routes.REVIEWS} exact>
      <h1>REVIEWS</h1>
    </PrivateRoute>
    <PrivateRoute path={routes.REQUESTS} exact>
      <h1>REQUESTS</h1>
    </PrivateRoute>
    <Route>
      <Redirect to={routes.LANDING} />
    </Route>
  </Switch>
);

export default App;
