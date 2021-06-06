import tokenStore from "./_tokenStore_v2";
import _client from "./_client";
import { retryRequest } from "../utils";

type LoginParams = { username: string; password: string };
type LoginResponseData = { refresh: string; access: string };
const LOGIN_ENDPOINT = "token/";
const LOGIN_RETRIES = 3;

// NOTE: consider adding configuration object
// { token: { storage, storageKey, validationOffset, requestAgent, retries }
// , login: { requestAgent, retries },
// , retries
// , }

const _initialState: {
  status: "offline";
  getToken: () => Promise<never>;
  userId: null;
} = {
  status: "offline",
  getToken: () => Promise.reject(new Error("User is not logged in.")),
  userId: null,
};

let _authState:
  | { status: "online"; getToken: () => Promise<string>; userId: number }
  | typeof _initialState = _initialState;

const _startSuccessResponse = (userId: number) => ({
  message: "Auth service started",
  userId,
});

const _startFailedResponse = (error: Error | string) => {
  tokenStore.reset();
  localStorage.clear();
  return error instanceof Error ? error : new Error(error);
};

const _start = (refresh?: string, access?: string) =>
  _authState.status === "offline"
    ? tokenStore
        .init(refresh, access)
        .then(({ userId, request }) => {
          if (userId) {
            _authState = { status: "online", getToken: request, userId };
            return _startSuccessResponse(userId);
          }
          return Promise.reject("Failed to login user");
        })
        .catch(error => {
          throw _startFailedResponse(error);
        })
    : Promise.resolve(_startSuccessResponse(_authState.userId));

const start = () => _start();

const login = (params: LoginParams) =>
  _authState.status === "offline"
    ? retryRequest(
        () => _client.post<LoginResponseData>(LOGIN_ENDPOINT, params),
        LOGIN_RETRIES,
      ).then(res =>
        _start(res.data.refresh, res.data.access).then(({ userId }) => ({
          response: res,
          userId,
        })),
      )
    : Promise.reject(new Error("User is already logged-in"));

const logout = () => {
  if (_authState.status === "online") {
    // TODO: add logout endpoint to backend server
    // const response = await _client.post("token/blacklist/", {jti: "get refresh jti"})
    tokenStore.reset();
    _authState = _initialState;
    // return response;
  }
};

const getToken = () => _authState.getToken();

const authService = {
  start,
  getToken,
  login,
  logout,
};

export default authService;
