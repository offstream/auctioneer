import axios, { AxiosRequestConfig } from "axios";
import authService from "./authService";

const CONFIG: AxiosRequestConfig = {
  baseURL: "/api/",
  timeout: 5000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const client = axios.create(CONFIG);

client.interceptors.request.use(async request => {
  const accessToken = await authService.getToken();
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

export { client, CONFIG };
