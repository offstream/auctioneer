import React from "react";
import { Outlet } from "react-router-dom";

import { CreateProduct } from "./CreateProduct";
import { ViewProduct } from "./ViewProduct";

export const PRODUCT_ROUTE = {
  path: "product",
  element: <Outlet />,
  children: [
    { path: "new", element: <CreateProduct /> },
    { path: ":id", element: <ViewProduct /> },
  ],
};
