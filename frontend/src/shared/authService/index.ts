import jwtDecode from "jwt-decode";
import tokenStore from "./_tokenStore";
import _client from "./_client";

// import { delay } from "../utils";

// TODO: proper status checking (FSM thingy???)
let _authState: {
  status: "uninitialized" | "online" | "offline";
} = {
  status: "uninitialized",
};

// login
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

const authService = {
  start: async (setUserIdCallback: (userId: number | null) => void) => {
    if (_authState.status === "uninitialized") {
      return tokenStore
        .init() // .then(delay(1000))
        .then(({ refresh }) => {
          const userId = _getUserId(refresh);
          _authState = { status: userId === null ? "offline" : "online" };
          setUserIdCallback(userId);
          return Promise.resolve("Auth service started.");
        })
        .catch(error => {
          console.log(error);
          localStorage.clear();
          _authState = { status: "offline" };
          setUserIdCallback(null);
          throw error;
        });
    }
    return Promise.resolve("Auth service started.");
  },

  getToken: tokenStore.get,

  login: async (params: LoginParams) => {
    if (_authState.status === "offline") {
      const response = await _client.post<LoginResponseData>("token/", params);
      const { refresh, access } = response.data;
      const userId = _getUserId(refresh ?? "");

      if (userId === null) {
        return Promise.reject(new Error("Error logging in"));
      }

      tokenStore.init(refresh, access);
      _authState = { ..._authState, status: "online" };
      return { response, userId };
    }
    return Promise.reject(new Error("Error logging in."));
  },

  logout: () => {
    if (_authState.status === "online") {
      // request logout??
      // const response = await _client.post("token/blacklist/", {jti: "get refresh jti"})
      tokenStore.reset();
      _authState = { ..._authState, status: "offline" };
      // return response;
    }
  },

  // register
  // type RegisterParams = LoginParams & { email: string };
  // const register = async (params: RegisterParams) => {
  //   return _client.post<RegisterParams>("auth/register/", params);
  // };
};

export default authService;
