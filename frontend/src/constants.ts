import {AxiosRequestConfig} from "axios";
const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("authorization")
    },
};

export const AXIOS_CONFIG = config;
