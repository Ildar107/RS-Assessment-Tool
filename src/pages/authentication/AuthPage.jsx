import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Select, Button } from 'antd';
import './authPage.scss';

const { Option } = Select;

const AuthPage = ({ setIsAuthenticatedState, setRole, role }) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="auth-page-wrapper">
      <label className="label-for-select">
        Choose your role:
        <br />
        <Select
        // style={{ width: 110 }}
          value={role}
          onChange={(value) => {
            setRole(value);
          }}
        >
          <Option value="author">Author</Option>
          <Option value="student">Student</Option>
          <Option value="supervisor">Supervisor</Option>
          <Option value="course_manager">Course Manager</Option>
        </Select>

      </label>
      <Button
        type="primary"
        onClick={() => {
          setIsAuthenticatedState(true);
          localStorage.setItem('isAuthenticated', true);
          localStorage.setItem('role', role);
          loginWithRedirect();
        }}
      >
        Login with GitHub
      </Button>

    </div>
  );
};

export default AuthPage;
