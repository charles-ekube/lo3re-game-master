import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/styles/utilsStyles.css';
import './assets/styles/authStyles.css';
import './assets/styles/generalStyles.css';
import './assets/styles/fontStyles.css';
import './assets/styles/dashboardStyles.css';
import './assets/styles/overviewStyles.css';
import "./assets/styles/walletStyles.css";
// import './assets/styles/cardStyles.css';

import "react-datepicker/dist/react-datepicker.css";

import './assets/fonts/fonts.css';
import { BrowserRouter } from 'react-router-dom';
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import 'react-step-progress/dist/index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
