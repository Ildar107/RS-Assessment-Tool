import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthPage = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div>
      <button type="button" onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
};

export default AuthPage;
