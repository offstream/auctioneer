import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  return (
    <div className='layout'>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
