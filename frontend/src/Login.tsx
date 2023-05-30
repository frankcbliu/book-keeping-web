import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from "react-router-dom";
import userApi from "./api/user"

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { span: 24 },
};

// 登录页面
const Login: React.FC = () => {
    const navigate = useNavigate()

    const onFinish = async (params: any) => {
        userApi.userLogin(params).then(() => {
            message.success('登录成功')
            navigate('/main')
        }).catch((err) => {
            message.error(err)
        })
    };


    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ padding: 20 }}>
            <Form.Item
                label="Username" name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input />
            </Form.Item>

            <Form.Item
                label="Password" name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;