import React from "react";

const Dashboard = () => {
  return <h1>This is the User's Personal Home Page.</h1>;
};

export const DASHBOARD_ROUTE = {
  path: "dashboard",
  element: <Dashboard />,
};
