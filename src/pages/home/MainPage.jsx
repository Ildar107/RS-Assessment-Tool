import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import routes from '../../constants/routes';

const MainPage = () => {
  const { logout } = useAuth0();
  return (
    <div>
      <ul>
        {/* <li><Link to={routes.MAINPAGE}><span>Main Page</span></Link></li> */}
        <li><Link to={routes.TASKS}><span>Tasks</span></Link></li>
        <li><Link to={routes.REVIEWS}><span>Reviews</span></Link></li>
        <li><Link to={routes.REQUESTS}><span>Review requests</span></Link></li>
        <button type="button" onClick={() => logout()}>Log Out</button>
      </ul>
    </div>
  );
};

export default MainPage;
