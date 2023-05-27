import {AxiosRequestConfig} from "axios";

export const API_BASE_URL = 'http://127.0.0.1:9988';

const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: {
        Cookie: localStorage.getItem("set-cookie"),
        "Content-Type": "application/json",
    },
};

export const AXIOS_CONFIG = config;
