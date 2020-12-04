import React from "react";
import { Navigate } from "react-router-dom";

import { AuthLayout } from "./AuthLayout";
import { MainLayout } from "./MainLayout";

import { HOME_ROUTE } from "./Home";
import { DASHBOARD_ROUTE } from "./Dashboard";
import { PRODUCT_ROUTE } from "./Product";
import { LOGIN_ROUTE } from "./Login";
import { REGISTER_ROUTE } from "./Register";

export const routes = (isLoggedIn: boolean) => [
  {
    path: "/",
    element: !isLoggedIn ? (
      <Navigate to={LOGIN_ROUTE.path} replace={true} />
    ) : (
      <MainLayout />
    ),
    children: [
      HOME_ROUTE, //
      DASHBOARD_ROUTE,
      PRODUCT_ROUTE,
    ],
  },
  {
    path: "/",
    element: !!isLoggedIn ? (
      <Navigate to={HOME_ROUTE.path} replace={true} />
    ) : (
      <AuthLayout />
    ),
    children: [
      LOGIN_ROUTE, //
      REGISTER_ROUTE,
    ],
  },
  {
    path: "*",
    element: <h1>404 NOT FOUND</h1>,
  },
];
