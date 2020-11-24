import { useRoutes } from "react-router-dom";

import { routes } from "./routes";
import { useAuthStore } from "./shared/useAuthStore";

const App = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  let element = useRoutes(routes(isLoggedIn));

  return element;
};

export default App;
