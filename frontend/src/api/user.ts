import axios from './instance/bff_instance'

const userApi = {
    userLogin,
}

export interface UserLoginParams {
    username?: string;
    password?: string;
}

/**
 * 登录接口
 * @returns
 * @param params
 */
function userLogin(params: UserLoginParams) {
    const { username, password } = params || {};
    return axios({
        method: 'POST',
        url: '/user/login',
        data: {
            username: username,
            password: password,
        },
    });
}

export default userApi