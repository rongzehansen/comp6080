import React from 'react';
import ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { CssBaseline } from '@mui/material';
import App from './App';
import DashboardPage from './views/DashboardPage.jsx';
import GameOnePage from './views/GameOnePage.jsx';
import GameTwoPage from './views/GameTwoPage.jsx';
import GameThreePage from './views/GameThreePage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/game/math",
    element: <GameOnePage />,
  },
  {
    path: "/game/connect",
    element: <GameTwoPage />,
  },
  {
    path: "/game/memory",
    element: <GameThreePage />
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root')
);
