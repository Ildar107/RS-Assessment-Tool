import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Select, Button,
} from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import './authPage.scss';

const { Option } = Select;

const AuthPage = ({ setIsAuthenticatedState, setRole, role }) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="auth-page-wrapper">

      <form className="form-container">
        <h2 className="header__title">Sign In</h2>
        <div className="control">
          <label>Choose your role:</label>
          <Select
            value={role}
            required
            name="role"
            onChange={(value) => {
              setRole(value);
            }}
          >
            <Option value="author">Author</Option>
            <Option value="student">Student</Option>
            <Option value="supervisor">Supervisor</Option>
          </Select>

        </div>
        <Button
          type="primary"
          icon={<GithubOutlined />}
          onClick={() => {
            setIsAuthenticatedState(true);
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('role', role);
            loginWithRedirect();
          }}
        >
          Sign up with GitHub
        </Button>
      </form>

      <div className="content" />
    </div>
  );
};

export default AuthPage;
