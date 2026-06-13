import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import RFQInbox from '../pages/RFQInbox';
import PricingAdmin from '../pages/PricingAdmin';
import QuoteHistory from '../pages/QuoteHistory';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'rfq',
        element: <RFQInbox />,
      },
      {
        path: 'pricing',
        element: <PricingAdmin />,
      },
      {
        path: 'history',
        element: <QuoteHistory />,
      },
    ],
  },
]);
