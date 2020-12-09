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

let _storeState: _StoreState = _INITIAL_STATE;

const _validateToken = (token: string) => {
  try {
    const now = Math.ceil(new Date().getTime() / 1000); // convert to seconds
    const exp = jwtDecode<JwtPayload>(token).exp; // in seconds
    return !!exp && exp - _TOKEN_VALIDATION_OFFSET > now;
  } catch {
    return false;
  }
};

const _requestRefresh = (refreshToken?: string) => {
  // console.log("Refreshing token...");
  return _client
    .post<{ access: string }>(`token/refresh/`, {
      refresh: refreshToken ?? _storeState.refresh,
    })
    .then(req => req.data.access);
};

const _genTokenPromise = (refreshToken?: string) =>
  new Promise<string>((resolve, reject) => {
    if (_validateToken(refreshToken ?? _storeState.refresh)) {
      _requestRefresh(refreshToken)
        .then(accessToken => {
          _storeState.status = "idle";
          _storeState.access = accessToken;
          resolve(accessToken);
        })
        .catch(reject);
    } else {
      reject(new Error("User has been logged out."));
    }
  });

const tokenStore = {
  init: async (refresh: string = "", access: string = "") => {
    if (_storeState.status === "uninitialized") {
      if (refresh) {
        localStorage.setItem(_TOKEN_STORAGE_KEY, refresh);
        _storeState = {
          refresh,
          access,
          status: "idle",
          request: Promise.resolve(access),
        };
      } else {
        const storedRefresh = localStorage.getItem(_TOKEN_STORAGE_KEY);
        if (storedRefresh) {
          _storeState = {
            ..._storeState,
            refresh: storedRefresh,
            status: "fetching",
            request: _genTokenPromise(storedRefresh),
          };

          return _storeState.request.then(() =>
            Promise.resolve({ status: "initialized", refresh: _storeState.refresh }),
          );
        }
      }
    }
    return Promise.resolve({ status: "initialized", refresh: _storeState.refresh });
  },
  get: (): Promise<string> => {
    switch (_storeState.status) {
      case "uninitialized":
        return Promise.reject(new Error("User is not logged in."));
      case "idle":
        if (_validateToken(_storeState.access)) {
          return Promise.resolve(_storeState.access);
        } else {
          _storeState = {
            ..._storeState,
            status: "fetching",
            request: _genTokenPromise(),
          };
          return _storeState.request;
        }
      case "fetching":
        return _storeState.request;
      default:
        return Promise.reject(new Error("An error occured."));
    }
  },
  reset: () => {
    if (_storeState.status !== "uninitialized") {
      _storeState = _INITIAL_STATE;
      localStorage.removeItem(_TOKEN_STORAGE_KEY);
    }
  },
  // REVIEW: currently unused and untested
  refresh: () => {
    // this method skips checking access token validation
    if (_storeState.status === "idle") {
      _storeState = {
        ..._storeState,
        status: "fetching",
        request: _genTokenPromise(),
      };
    }
  },
  getRefreshToken: () => _storeState.refresh,
};

Object.freeze(tokenStore);
export default tokenStore;
