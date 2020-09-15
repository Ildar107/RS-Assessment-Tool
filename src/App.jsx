import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import { DatePicker } from 'antd';
import routes from './constants/routes';
import { EditCheckingList } from './assets/components/EditCheckingList';

const App = () => (
  <Switch>
    <Route>
      <Redirect to={routes.EditCheckingList} />
      <EditCheckingList />
    </Route>
    <Route path={routes.LANDING} exact>
      <h1>Start Project!</h1>
      <DatePicker />
    </Route>
    <Route path={routes.TEAM} exact>
      <h1>Dream Team</h1>
    </Route>
    <Route>
      <Redirect to={routes.LANDING} />
    </Route>

  </Switch>
);

export default App;
