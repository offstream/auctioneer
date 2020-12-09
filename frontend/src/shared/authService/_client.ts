import axios from "axios";
import { CONFIG } from "../apiClient";

const _client = axios.create(CONFIG);

// TODO: possibly add retry on response interceptor

export default _client;
