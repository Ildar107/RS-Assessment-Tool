import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, Button, Menu } from 'antd';
import routes from '../../constants/routes';
import './mainPage.scss';

const { Meta } = Card;

const MainPage = ({ setIsAuthenticatedState, role }) => {
  const { logout, user } = useAuth0();
  if (user) localStorage.setItem('user', JSON.stringify(user));
  //  const { user } = useAuth0();
  // const { nickname, picture } = user;
  console.log('user', user);
  return (
    <div className="main-page-wrapper">
      <div className="user-info-and-menu-wrapper">
        <Card
          className="user-card"
          cover={(
            <img
              src={user?.picture || JSON.parse(localStorage.getItem('user'))?.picture}
              alt="pic"
              style={{ border: '1px solid #1112', borderRadius: '50%', width: '200px' }}
            />
          )}
        >
          <Meta
            style={{ textAlign: 'center' }}
            title={user?.nickname || JSON.parse(localStorage.getItem('user'))?.nickname}
            description={role}
          />
        </Card>
        <Button
          type="primary"
          style={{ margin: 20 }}
          onClick={() => {
            localStorage.setItem('isAuthenticated', false);
            setIsAuthenticatedState(false);
            logout();
          }}
        >
          Log Out
        </Button>
        <div>
          <Menu
            mode="inline"
            style={{ textAlign: 'center' }}
          >
            <Menu.Item>
              <Link to={routes.TASKS}><span>Tasks</span></Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={routes.REQUESTS}><span>Review requests</span></Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={routes.REVIEWS}><span>Reviews</span></Link>
            </Menu.Item>
          </Menu>
        </div>
      </div>
      <div className="main-page-content-wrapper" />
    </div>
  );
};

export default MainPage;
