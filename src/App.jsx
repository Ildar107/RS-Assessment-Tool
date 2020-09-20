import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
// import { DatePicker } from 'antd';
import routes from './constants/routes';
import MainPage from './pages/home/MainPage';
import AuthPage from './pages/authentication/AuthPage';
import PrivateRoute from './components/PrivateRoute';

// const Tasks = <h1>TASKS</h1>;
const App = () => (
  <Switch>
    <Route path={routes.AUTHENTICATION} exact component={AuthPage} />
    <PrivateRoute path={routes.LANDING} exact component={MainPage} />
    <Route path={routes.TEAM} exact component={() => <h1>Dream Team</h1>} />
    {/* <Route path={routes.MAINPAGE} exact>
      <h1>MAINPAGE</h1>
    </Route> */}

    <PrivateRoute path={routes.TASKS} exact component={() => <h1>TASKS</h1>} />
    <PrivateRoute path={routes.REVIEWS} exact component={() => <h1>REVIEWS</h1>} />
    <PrivateRoute path={routes.REQUESTS} exact component={() => <h1>REQUESTS</h1>} />
    <Route>
      <Redirect to={routes.LANDING} />
    </Route>
  </Switch>
);

export default App;
