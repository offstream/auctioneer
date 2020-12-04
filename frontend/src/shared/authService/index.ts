import tokenStore from "./_tokenStore";
import _client from "./_client";
import { setUserIdFromToken } from "../useUserStore";

// login
type LoginParams = {
  username: string;
  password: string;
};
type LoginResponseData =
  | { refresh: string; access: string; detail?: undefined }
  | { refresh?: undefined; access?: undefined; detail: string };

const login = async (params: LoginParams) => {
  const response = await _client.post<LoginResponseData>("token/", params);
  const { refresh, access } = response.data;
  tokenStore.init(refresh, access);
  setUserIdFromToken(refresh!);
  return response;
};

// logout
const logout = () => {
  // request logout??
  // const response = await _client.post("token/blacklist/", {jti: "get refresh jti"})
  tokenStore.reset();
  localStorage.clear();
  setUserIdFromToken("");
  // return response;
};

// register
// type RegisterParams = LoginParams & { email: string };
// const register = async (params: RegisterParams) => {
//   return _client.post<RegisterParams>("auth/register/", params);
// };

export { tokenStore, login, logout };
