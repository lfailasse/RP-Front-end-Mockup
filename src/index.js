import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Pages/Login';
import { RoutesNav } from './Components/RoutesNav/RoutesNav';
import Sidemenu from './Components/Sidemenu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RoutesNav>
        <Login/>
    </RoutesNav>
);