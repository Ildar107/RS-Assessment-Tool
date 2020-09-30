import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticatedState, ...args }) => {
  console.log('PR authenticated', isAuthenticatedState);

  return isAuthenticatedState === 'true' ? <Route {...args} /> : (
    <Redirect
      to={{
        pathname: '/authentication',
      }}
    />
  );
};

export default PrivateRoute;
