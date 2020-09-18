import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';

const MainPage = () => (
  <div>
    <ul>
      <li><Link to={routes.TASKS}><span>Tasks</span></Link></li>
      <li><Link to={routes.REVIEWS}><span>Reviews</span></Link></li>
      <li><Link to={routes.REQUESTS}><span>Review requests</span></Link></li>
    </ul>
  </div>
);

export default MainPage;
