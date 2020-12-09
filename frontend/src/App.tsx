import { useRoutes } from "react-router-dom";
import { routes } from "./routes";

type AppProps = {
  initializeAuth: () => { isLoggedIn: boolean; status: string; error: string };
};

const App: React.FC<AppProps> = ({ initializeAuth }) => {
  const { isLoggedIn } = initializeAuth();
  const element = useRoutes(routes(isLoggedIn));

  return element;
};

export default App;
