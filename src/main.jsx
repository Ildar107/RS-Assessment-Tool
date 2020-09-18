import * as React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
// import { Auth0Provider } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './auth0-provider-with-history';
import App from './App';
import routes from './constants/routes';
import './assets/styles/main.scss';
import 'antd/dist/antd.css';
// import './assets/style/icons.min.css';
ReactDOM.render(
  <HashRouter basename={routes.LANDING}>
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  </HashRouter>,
  document.getElementById('root'),
);
