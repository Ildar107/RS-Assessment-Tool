import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import routes from './constants/routes';

const App = () => (
  <Switch>
    <Route path={routes.LANDING} exact>
      <h1>Start Project!</h1>
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
