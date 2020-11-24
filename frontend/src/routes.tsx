import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthLayout } from "./AuthLayout/AuthLayout";
import { MainLayout } from "./MainLayout/MainLayout";

import { Home } from "./Home";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { Register } from "./Register";

export const routes = (isLoggedIn: boolean) => [
  {
    path: "/",
    element: !isLoggedIn ? <Navigate to='/login' replace={true} /> : <MainLayout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "product",
        element: <Outlet />,
        children: [
          { path: "new", element: <h1>Add New Product</h1> },
          { path: ":id", element: <h1>View Product</h1> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: !!isLoggedIn ? <Navigate to='/home' replace={true} /> : <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "*",
    element: <h1>404 NOT FOUND</h1>,
  },
];
