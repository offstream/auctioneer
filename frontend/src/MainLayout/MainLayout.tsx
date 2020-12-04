import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { HOME_ROUTE } from "../Home";
import Footer from "./Footer";
import Header from "./Header";

import styles from "./MainLayout.module.scss";

const DEFAULT_PATH = HOME_ROUTE.path;

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate(DEFAULT_PATH, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className={styles.App}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
