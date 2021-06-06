import jwtDecode from "jwt-decode";
import tokenStore from "./_tokenStore";
import _client from "./_client";

// TODO: inspect error handling

let _authState: {
  status: "uninitialized" | "online" | "offline";
} = {
  status: "uninitialized",
};

type LoginParams = {
  username: string;
  password: string;
};
type LoginResponseData =
  | { refresh: string; access: string; detail?: undefined }
  | { refresh?: undefined; access?: undefined; detail: string };

function _getUserId(token: string) {
  try {
    return jwtDecode<{ user_id?: number }>(token).user_id ?? null;
  } catch {
    return null;
  }
}

const start = async () => {
  if (_authState.status === "uninitialized") {
    try {
      const { refresh } = await tokenStore.init();
      const userId = _getUserId(refresh);
      _authState = { status: userId === null ? "offline" : "online" };
      return { message: "Auth service started.", userId };
    } catch (error) {
      localStorage.clear();
      _authState = { status: "offline" };
      throw error;
    }
  }
  return {
    message: "Auth service started.",
    userId: _getUserId(tokenStore.getRefreshToken()),
  };
};

const login = async (params: LoginParams) => {
  if (_authState.status === "offline") {
    const response = await _client.post<LoginResponseData>("token/", params);
    const { refresh, access } = response.data;
    const userId = _getUserId(refresh ?? "");

    if (userId === null) {
      throw new Error("Error logging in");
    }

    tokenStore.init(refresh, access);
    _authState = { ..._authState, status: "online" };
    return { response, userId };
  }
  throw new Error("Error logging in.");
};

const logout = () => {
  if (_authState.status === "online") {
    // TODO: add logout endpoint to backend server
    // const response = await _client.post("token/blacklist/", {jti: "get refresh jti"})
    tokenStore.reset();
    _authState = { ..._authState, status: "offline" };
    // return response;
  }
};

// TODO: add register method
// register
// type RegisterParams = LoginParams & { email: string };
// const register = async (params: RegisterParams) => {
//   return _client.post<RegisterParams>("auth/register/", params);
// };

const authService = Object.freeze({ start, getToken: tokenStore.get, login, logout });

export default authService;
