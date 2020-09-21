import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthPage = ({ setIsAuthenticatedState, setRole, role }) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsAuthenticatedState(true);
          localStorage.setItem('isAuthenticated', true);
          localStorage.setItem('role', role);
          loginWithRedirect();
        }}
      >
        Log In
      </button>
      <select
        value={role}
        onChange={({ target }) => {
          setRole(target.value);
        }}
      >
        <option value="author">author</option>
        <option value="student">student</option>
        <option value="supervisor">supervisor</option>
        <option value="course_manager">course_manager</option>
      </select>
    </div>
  );
};

export default AuthPage;
