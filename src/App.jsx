import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
// import { DatePicker } from 'antd';
import routes from './constants/routes';
import MainPage from './pages/home/MainPage';

const App = () => (
  <Switch>
    <Route path={routes.LANDING} exact>
      {/* <h1>Start Project!</h1>
      <DatePicker /> */}
      <MainPage />
    </Route>
    <Route path={routes.TEAM} exact>
      <h1>Dream Team</h1>
    </Route>
    {/* <Route path={routes.MAINPAGE} exact>
      <h1>MAINPAGE</h1>
    </Route> */}
    <Route path={routes.TASKS} exact>
      <h1>TASKS</h1>
    </Route>
    <Route path={routes.REVIEWS} exact>
      <h1>REVIEWS</h1>
    </Route>
    <Route path={routes.REQUESTS} exact>
      <h1>REQUESTS</h1>
    </Route>
    <Route>
      <Redirect to={routes.LANDING} />
    </Route>
  </Switch>
);

export default App;
