import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './context/AuthContext'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import ListingsPage from './views/ListingsPage';
import { HostingPage } from './views/HostingPage';
import ListingPage from './views/ListingPage';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  // You can add more route objects here
  {
    path: '/listings',
    element: <ListingsPage />,
  },
  {
    path: '/listings/login',
    element: <ListingsPage />,
  },
  {
    path: '/listings/register',
    element: <ListingsPage />,
  },
  {
    path: '/hosting',
    element: <HostingPage />
  },
  {
    path: '/hosting/listing/edit/:id',
    element: <HostingPage />,
  },
  {
    path: '/listings/:listingId',
    element: <ListingPage />,
  },
  {
    path: '/hosting/listing/history/:id',
    element: <HostingPage />,
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
