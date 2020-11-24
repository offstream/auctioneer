import React from "react";
import { render } from "react-dom";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";
import App from "./App";

const queryCache = new QueryCache();

render(
  <React.StrictMode>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <BrowserRouter>
        <App />
        {/* <ReactQueryDevtools /> */}
      </BrowserRouter>
    </ReactQueryCacheProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
