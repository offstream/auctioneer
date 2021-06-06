import jwtDecode, { JwtPayload } from "jwt-decode";
import _client from "./_client";
import { retryRequest } from "../utils";

type RefreshResponseData = { access: string; detail?: string };

const _TOKEN_STORAGE = localStorage;
const _TOKEN_STORAGE_KEY = "refreshToken";
const _TOKEN_VALIDATION_OFFSET = 5; // in seconds, invalidate the token ealier
const _TOKEN_REFRESH_ENDPOINT = "token/refresh/";
const _TOKEN_REFRESH_RETRIES = 3;

function now() {
  return Math.ceil(new Date().getTime() / 1000);
}

function _getStoredRefresh() {
  return _TOKEN_STORAGE.getItem(_TOKEN_STORAGE_KEY);
}

function _refreshToken(refresh: string) {
  console.log("Refreshing token...");
  return retryRequest(
    () => _client.post<RefreshResponseData>(_TOKEN_REFRESH_ENDPOINT, { refresh }),
    _TOKEN_REFRESH_RETRIES,
  );
}

function _validateTokenExp(token: string) {
  try {
    const exp = jwtDecode<JwtPayload>(token).exp;
    return !!exp && exp - _TOKEN_VALIDATION_OFFSET > now();
  } catch {
    return false;
  }
}

function _createAccessTokenRequest(refreshToken: string, accessToken = "") {
  let isFetching = false;
  let _accessToken = accessToken;
  let request = Promise.resolve(accessToken);

  function genRequest() {
    // NOTE: Consider rejecting with a 401 Response Error?
    return _getStoredRefresh() === refreshToken
      ? _refreshToken(refreshToken).then(res =>
          res.data?.access
            ? (_accessToken = res.data.access)
            : Promise.reject(new Error("Could not authenticate user.")),
        )
      : Promise.reject(new Error("Invalid Refresh Token"));
  }

  return function (): Promise<string> {
    if (!isFetching && !_validateTokenExp(_accessToken)) {
      isFetching = true;
      request = genRequest().finally(() => {
        isFetching = false;
      });
    }
    return request;
  };
}

function _getUserId(token: string) {
  try {
    return jwtDecode<{ user_id?: number }>(token).user_id ?? null;
  } catch {
    return null;
  }
}

function initializeTokenStore(refreshToken?: string, accessToken?: string) {
  const _refreshToken =
    refreshToken ?? _TOKEN_STORAGE.getItem(_TOKEN_STORAGE_KEY) ?? "";
  const _accessToken = accessToken ?? "";
  if (!_refreshToken) {
    return Promise.reject(new Error("Refresh Token not found."));
  } else if (!_validateTokenExp(_refreshToken)) {
    return Promise.reject(new Error("Expired or Invalid Refresh Token"));
  }

  const request = _createAccessTokenRequest(_refreshToken, _accessToken);
  const userId = _getUserId(_refreshToken);
  return request().then(_ => {
    _TOKEN_STORAGE.setItem(_TOKEN_STORAGE_KEY, _refreshToken);
    return { userId, request };
  });
}

// NOTE: consider adding configuration object
// { storage, storageKey, validationOffset, refreshEndpoint, retries }
const tokenStore = {
  init: initializeTokenStore,
  reset: () => _TOKEN_STORAGE.removeItem(_TOKEN_STORAGE_KEY),
};
export default tokenStore;
