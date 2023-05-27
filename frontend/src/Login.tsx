import React from 'react';
import {Button, Form, Input} from 'antd';
import {API_BASE_URL, AXIOS_CONFIG} from "./constants";
import {useNavigate} from "react-router-dom";
import axios, {AxiosResponse} from "axios";

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};

const tailLayout = {
    wrapperCol: {span: 24},
};

const Login: React.FC = () => {
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        // try {
        //     const response = await fetch(API_BASE_URL + "/user/login", {
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify(values),
        //     });
        //
        //     if (response.ok) {
        //         console.log('Login successful');
        //         navigate('/record')
        //     } else {
        //         console.log('Login failed');
        //     }
        // } catch (error) {
        //     console.error('Login error:', error);
        // }
        axios.post<[]>(API_BASE_URL + "/user/login", values,  {
            withCredentials: true, // 设置 withCredentials 选项
            responseType: "text", // 设置响应类型为 "text"
        }).then((response) => {
            console.log('Login successful');
            console.log(response.headers)
            const setCookie = response.headers["set-cookie"]; // 获取 Set-Cookie 头部
            console.log(setCookie);
            if (setCookie) {
                const cookies = setCookie.map((cookie: string) => cookie.split(";")[0]).join(";"); // 获取 cookie
                console.log(cookies);
            }
            console.log(response.data);
            // navigate('/record')
        });
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{padding: 20}}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{required: true, message: 'Please input your username!'}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{required: true, message: 'Please input your password!'}]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;