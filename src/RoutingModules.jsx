import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Login from './pages/Login'
import PracticePage from './pages/PracticePage'

function RoutingModule() {

    const AppRoutes = createBrowserRouter([
        // { path: "/", element: <Login /> },
         { path: "/practice-page", element: <PracticePage /> },

    ])
  return <RouterProvider router={AppRoutes} />
}

export default RoutingModule
