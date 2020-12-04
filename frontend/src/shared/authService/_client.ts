import axios from "axios";
import { CONFIG } from "../apiClient";

const _client = axios.create(CONFIG);

// retry interceptor??

export default _client;
