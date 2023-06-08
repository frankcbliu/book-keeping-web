import axios from './instance/bff_instance'

const userApi = {
  userLogin,
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

export default userApi