import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: '/api',
  headers: {
    "Content-Type": 'application/json',
  },
});

// 请求中间层
instance.interceptors.request.use(
  config => {
    const authorization = localStorage.getItem("authorization")
    if (authorization) { // 自动带上 authorization
      config.headers['Authorization'] = authorization
    }
    return config;
  },
  error => {
    console.error("[interceptors.request]", error)
    return Promise.reject(error);
  }
);

// 回包中间层
instance.interceptors.response.use((response) => {
  const authorization = response.headers["authorization"]; // 获取 Set-Cookie 头部
  if (authorization) {
    // 自动更新 authorization
    localStorage.setItem("authorization", authorization)
  }
  const {code} = response.data;
  // 返回码模式，code为0则表示成功，其他为预料之内的失败
  if (code === 0) {
    return Promise.resolve(response.data);
  }
  return Promise.reject(response.data?.msg);
});

export default instance;
