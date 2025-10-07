import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import RootLayout from '@/pages/RootLayout';
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const AppLayout = lazy(() => import('@/pages/app/AppLayout'));
const ChatsPage = lazy(() => import('@/pages/app/ChatsPage'));
const ProfilePage = lazy(() => import('@/pages/app/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage'));
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}><LoginPage /></Suspense>,
      },
      {
        path: "register",
        element: <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}><RegisterPage /></Suspense>,
      },
      {
        path: "app",
        element: <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}><AppLayout /></Suspense>,
        children: [
          {
            path: "chats",
            element: <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}><ChatsPage /></Suspense>,
          },
          {
            path: "chats/:chatId",
            element: <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}><ChatsPage /></Suspense>,
          },
          {
            path: "profile",
            element: <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}><ProfilePage /></Suspense>,
          },
          {
            path: "settings",
            element: <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}><SettingsPage /></Suspense>,
          },
        ],
      },
    ],
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);