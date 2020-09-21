import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, Button } from 'antd';
import routes from '../../constants/routes';

const { Meta } = Card;

const MainPage = ({ setIsAuthenticatedState, role }) => {
  const { logout, user } = useAuth0();
  if (user) localStorage.setItem('user', JSON.stringify(user));
  //  const { user } = useAuth0();
  // const { nickname, picture } = user;
  console.log('user', user);
  return (
    <div className="main-page-wrapper">
      {/* <h3>{user?.nickname || JSON.parse(localStorage.getItem('user'))?.nickname}</h3>
      <h4>
        Role:
        {` ${role}`}
      </h4>
      <img src={user?.picture || JSON.parse(localStorage.getItem('user'))?.picture} alt="pic" /> */}
      <Card
        style={{ width: 300 }}
        cover={<img src={user?.picture || JSON.parse(localStorage.getItem('user'))?.picture} alt="pic" />}
      >
        <Meta
          title={user?.nickname || JSON.parse(localStorage.getItem('user'))?.nickname}
          description={role}
        />
      </Card>
      <ul>
        {/* <li><Link to={routes.MAINPAGE}><span>Main Page</span></Link></li> */}
        <li><Link to={routes.TASKS}><span>Tasks</span></Link></li>
        <li><Link to={routes.REVIEWS}><span>Reviews</span></Link></li>
        <li><Link to={routes.REQUESTS}><span>Review requests</span></Link></li>
        <Button
          type="primary"
          onClick={() => {
            localStorage.setItem('isAuthenticated', false);
            setIsAuthenticatedState(false);
            logout();
          }}
        >
          Log Out
        </Button>
      </ul>
    </div>
  );
};

export default MainPage;
