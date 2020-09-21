import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import routes from '../../constants/routes';

const MainPage = ({ setIsAuthenticatedState }) => {
  const { logout, user } = useAuth0();
  if (user) localStorage.setItem('user', JSON.stringify(user));
  //  const { user } = useAuth0();
  // const { nickname, picture } = user;
  console.log('user', user);
  console.log('cookies', document.cookie);
  return (
    <div>
      <h3>{user?.nickname || JSON.parse(localStorage.getItem('user'))?.nickname}</h3>
      <img src={user?.picture || JSON.parse(localStorage.getItem('user'))?.picture} alt="pic" />
      <ul>
        {/* <li><Link to={routes.MAINPAGE}><span>Main Page</span></Link></li> */}
        <li><Link to={routes.TASKS}><span>Tasks</span></Link></li>
        <li><Link to={routes.REVIEWS}><span>Reviews</span></Link></li>
        <li><Link to={routes.REQUESTS}><span>Review requests</span></Link></li>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem('isAuthenticated', false);
            setIsAuthenticatedState(false);
            logout();
          }}
        >
          Log Out
        </button>
      </ul>
    </div>
  );
};

export default MainPage;
