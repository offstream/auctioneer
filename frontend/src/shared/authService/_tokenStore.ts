import jwtDecode, { JwtPayload } from "jwt-decode";
import _client from "./_client";

type _tokenStore = {
  status: string;
  access: string;
  refresh: string;
  request?: Promise<string>;
};

const _store: _tokenStore = {
  status: "uninitialized",
  access: "",
  refresh: "",
};

const _TOLERANCE = 5; // in seconds, we use this to invalidate the token ealier
const _validateToken = (token: string) => {
  try {
    const now = Math.ceil(new Date().getTime() / 1000); // convert to seconds
    const exp = jwtDecode<JwtPayload>(token).exp; // in seconds
    return !!exp && exp - _TOLERANCE > now;
  } catch {
    return false;
  }
};

const _requestRefresh = () => {
  console.log("Refreshing token...");
  return _client
    .post<{ access: string }>(`token/refresh/`, {
      refresh: _store.refresh,
    })
    .then(req => req.data.access);
};

const _genTokenPromise = () =>
  new Promise<string>((resolve, reject) => {
    if (_validateToken(_store.refresh)) {
      _requestRefresh()
        .then(accessToken => {
          _store.status = "idle";
          _store.access = accessToken;
          resolve(accessToken);
        })
        .catch(reject);
    } else {
      reject(new Error("User has been logged out."));
    }
  });

const tokenStore = {
  init: (refresh: string = "", access: string = "") => {
    if (_store.status === "uninitialized") {
      const newRefresh = !!refresh ? refresh : localStorage.getItem("refreshToken");
      if (newRefresh) {
        localStorage.setItem("refreshToken", newRefresh);
        _store.refresh = newRefresh;
        _store.access = access;
        _store.status = "idle";
      }
    }
  },
  get: () => {
    switch (_store.status) {
      case "uninitialized":
        return Promise.reject(new Error("User is not logged in."));
      case "idle":
        if (_validateToken(_store.access)) {
          return Promise.resolve(_store.access);
        } else {
          _store.status = "fetching";
          _store.request = _genTokenPromise();

          return _store.request;
        }
      case "fetching":
        return _store.request;
    }
  },
  reset: () => {
    if (_store.status !== "uninitialized") {
      _store.status = "uninitialized";
      _store.access = "";
      _store.refresh = "";
      _store.request = undefined;
    }
  },
  refresh: () => {
    // this method skips checking access token validation
    if (_store.status === "idle") {
      _store.status = "fetching";
      _store.request = _genTokenPromise();
    }
  },
};

Object.freeze(tokenStore);
export default tokenStore;
