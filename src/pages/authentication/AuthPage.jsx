import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthPage = ({ setIsAuthenticatedState }) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsAuthenticatedState(true);
          localStorage.setItem('isAuthenticated', true);
          loginWithRedirect();
        }}
      >
        Log In
      </button>
    </div>
  );
};

export default AuthPage;
