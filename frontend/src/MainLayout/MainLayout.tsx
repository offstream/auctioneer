import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";

import styles from "./MainLayout.module.scss";

export const MainLayout: React.FC = () => (
  <div className={styles.App}>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);
