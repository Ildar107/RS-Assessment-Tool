import * as React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import routes from './constants/routes';
import './assets/styles/main.scss';
import 'antd/dist/antd.css';
// import './assets/style/icons.min.css';

ReactDOM.render(
  <HashRouter basename={routes.LANDING}>
    <App />
  </HashRouter>,
  document.getElementById('root'),
);
