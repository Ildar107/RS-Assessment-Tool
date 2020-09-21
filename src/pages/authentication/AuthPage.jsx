import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Select } from 'antd';

const { Option } = Select;

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
        Login with GitHub
      </button>
      <Select
        style={{ width: 110 }}
        value={role}
        onChange={(value) => {
          setRole(value);
        }}
      >
        <Option value="author">Author</Option>
        <Option value="student">Student</Option>
        <Option value="supervisor">Supervisor</Option>
        <Option value="course_manager">Manager</Option>
      </Select>
    </div>
  );
};

export default AuthPage;
