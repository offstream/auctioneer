import jwtDecode, { JwtPayload } from "jwt-decode";
import _client from "./_client";

// TODO: add proper error objects and messages

type _StoreState =
  | {
      status: "idle" | "fetching";
      access: string;
      refresh: string;
      request: Promise<string>;
    }
  | {
      status: "uninitialized";
      access: "";
      refresh: "";
      request: undefined;
    };

const _INITIAL_STATE: _StoreState = {
  status: "uninitialized",
  access: "",
  refresh: "",
  request: undefined,
};
const _TOKEN_VALIDATION_OFFSET = 5; // in seconds, invalidate the token ealier
const _TOKEN_STORAGE_KEY = "refreshToken";

let _tokenState: _StoreState = _INITIAL_STATE;

const _validateTokenExp = (token: string) => {
  try {
    const now = Math.ceil(new Date().getTime() / 1000); // convert to seconds
    const exp = jwtDecode<JwtPayload>(token).exp; // in seconds
    return !!exp && exp - _TOKEN_VALIDATION_OFFSET > now;
  } catch {
    return false;
  }
};

const _genTokenPromise = (refreshToken?: string) =>
  new Promise<string>((resolve, reject) => {
    if (_validateTokenExp(refreshToken ?? _tokenState.refresh)) {
      console.log("Refreshing token...");
      _client
        .post<{ access: string }>(`token/refresh/`, {
          refresh: refreshToken ?? _tokenState.refresh,
        })
        .then(({ data: { access: accessToken } }) => {
          _tokenState.status = "idle";
          _tokenState.access = accessToken;
          resolve(accessToken);
        })
        .catch(reject);
    } else {
      reject(new Error("User has been logged out."));
    }
  });

const init = async (refresh = "", access = "") => {
  if (_tokenState.status === "uninitialized") {
    const storedRefresh = localStorage.getItem(_TOKEN_STORAGE_KEY);
    if (!!refresh) {
      localStorage.setItem(_TOKEN_STORAGE_KEY, refresh);
      _tokenState = {
        refresh,
        access,
        status: "idle",
        request: Promise.resolve(access),
      };
    } else if (storedRefresh) {
      _tokenState = {
        ..._tokenState,
        refresh: storedRefresh,
        status: "fetching",
        request: _genTokenPromise(storedRefresh),
      };
      return _tokenState.request.then(() => ({
        status: "initialized",
        refresh: _tokenState.refresh,
      }));
    }
  }
  return Promise.resolve({ status: "initialized", refresh: _tokenState.refresh });
};

const get = (): Promise<string> => {
  switch (_tokenState.status) {
    case "uninitialized":
      return Promise.reject(new Error("User is not logged in."));
    case "idle":
      if (_validateTokenExp(_tokenState.access)) {
        return Promise.resolve(_tokenState.access);
      } else {
        _tokenState = {
          ..._tokenState,
          status: "fetching",
          request: _genTokenPromise(),
        };
        return _tokenState.request;
      }
    case "fetching":
      return _tokenState.request;
  }
};

const reset = () => {
  if (_tokenState.status !== "uninitialized") {
    _tokenState = _INITIAL_STATE;
    localStorage.removeItem(_TOKEN_STORAGE_KEY);
  }
};

// REVIEW: currently unused and untested
const refresh = () => {
  // this method skips checking access token validation
  if (_tokenState.status === "idle") {
    _tokenState = {
      ..._tokenState,
      status: "fetching",
      request: _genTokenPromise(),
    };
  }
};

const getRefreshToken = () => _tokenState.refresh;

const tokenStore = Object.freeze({ init, get, reset, refresh, getRefreshToken });

export default tokenStore;
