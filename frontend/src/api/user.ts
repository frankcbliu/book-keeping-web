import axios from './instance/bff_instance'

const userApi = {
  userLogin,
  checkAuth,
}

/**
 * 登录接口
 * @returns
 */
export async function userLogin(username: string, password: string): Promise<boolean> {
  try {
    await axios.post<any>('/user/login', {
      username: username,
      password: password,
    });
    return true;
  } catch (error) {
    console.error('[userLogin]', error)
    return false;
  }
}


/**
 * 校验登录
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await axios.post<any>('/user/auth');
    return true;
  } catch (error) {
    console.error('[checkAuth]', error)
    localStorage.removeItem('authorization')
    return false;
  }
}

export default userApi