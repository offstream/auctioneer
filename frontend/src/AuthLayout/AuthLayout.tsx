import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import styles from "./AuthLayout.module.scss";

const DEFAULT_PATH = "/login";

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
