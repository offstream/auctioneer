import jwtDecode from "jwt-decode";
import tokenStore from "./_tokenStore";
import _client from "./_client";

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

const authService = {
  start: async () => {
    if (_authState.status === "uninitialized") {
      return tokenStore
        .init()
        .then(({ refresh }) => {
          const userId = _getUserId(refresh);
          _authState = { status: userId === null ? "offline" : "online" };
          return Promise.resolve({ message: "Auth service started.", userId });
        })
        .catch(error => {
          // console.log(error);
          localStorage.clear();
          _authState = { status: "offline" };
          throw error;
        });
    }
    return Promise.resolve({
      message: "Auth service started.",
      userId: _getUserId(tokenStore.getRefreshToken()),
    });
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
