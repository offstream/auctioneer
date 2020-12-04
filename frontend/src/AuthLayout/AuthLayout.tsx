import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { LOGIN_ROUTE } from "../Login";

import styles from "./AuthLayout.module.scss";

const DEFAULT_PATH = LOGIN_ROUTE.path;

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate(DEFAULT_PATH, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className={styles.layout}>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
