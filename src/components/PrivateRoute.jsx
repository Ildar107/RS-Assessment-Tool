import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

// const PrivateRoute = ({ component, ...args }) => (
//   <Route
//     component={withAuthenticationRequired(component, {
//       onRedirecting: () => <div>Loading...</div>,
//     })}
//     {...args}
//   />
// );
const PrivateRoute = ({ isAuthenticatedState, ...args }) => {
  // const { isAuthenticated } = useAuth0();
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
