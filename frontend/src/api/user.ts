import axios from './instance/bff_instance'

const userApi = {
  userLogin,
  checkAuth,
}

/**
 * 登录接口
 * @returns
 */
export async function userLogin(username: string, password: string): Promise<any> {
  try {
    const response = await axios.post<any>('/user/login', {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('userLogin error', error)
    return null;
  }
}


/**
 * 校验登录
 */
export async function checkAuth(): Promise<any> {
  try {
    const response = await axios.post<any>('/user/auth');
    return response.data;
  } catch (error) {
    console.error('auth error', error)
    return null;
  }
}

export default userApi