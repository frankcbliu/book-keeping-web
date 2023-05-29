import {AxiosRequestConfig} from "axios";

const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("authorization")
    },
};

function UpdateConfig(authorization: string) {
    localStorage.setItem("authorization", authorization)
    if (config && config.headers) {
        config.headers.Authorization = authorization
    }
}

export const AXIOS_CONFIG = config;
export const UPDATE_CONFIG = UpdateConfig