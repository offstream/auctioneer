import React from "react";
import { render } from "react-dom";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";
import App from "./App";
import LoadingApp from "./LoadingApp";
import useInitializeAuth from "./shared/useInitializeAuth";

export const queryCache = new QueryCache();

const Root = () => {
  const initializeAuth = useInitializeAuth();
  return (
    <React.StrictMode>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <BrowserRouter>
          <React.Suspense fallback={<LoadingApp />}>
            <App initializeAuth={initializeAuth} />
          </React.Suspense>
          <ReactQueryDevtools />
        </BrowserRouter>
      </ReactQueryCacheProvider>
    </React.StrictMode>
  );
};

render(<Root />, document.getElementById("root"));

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
