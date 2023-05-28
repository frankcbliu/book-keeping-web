import React from 'react';
import {Button, Form, Input} from 'antd';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};

const tailLayout = {
    wrapperCol: {span: 24},
};

// 登录页面
const Login: React.FC = () => {
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        axios.post<[]>("/user/login", values).then((response) => {
            const authorization = response.headers["authorization"]; // 获取 Set-Cookie 头部
            localStorage.setItem("authorization", authorization)
            navigate('/ledger')
        });
    };


    const onFinishFailed = (errorInfo: any) => {
        localStorage.clear()
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