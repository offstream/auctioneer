import { useRoutes } from "react-router-dom";

import { routes } from "./routes";
import { useUserStore } from "./shared/useUserStore";

const App = () => {
  const user_id = useUserStore(state => state.user_id);
  let element = useRoutes(routes(!!user_id));

  return element;
};

export default App;
