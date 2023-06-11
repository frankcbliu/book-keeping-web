import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import userApi from "./api/user"
import { RoutePath, commonMessage } from "./constants";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { span: 24 },
};

// 登录页面
const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (params: any) => {
    const login_success = await userApi.userLogin(params['username'], params['password']);
    if (login_success) {
      commonMessage.success('登录成功')
      navigate(RoutePath.PATH_LEDGER)
    } else {
      commonMessage.error('登录失败')
    }
  };

  useEffect(() => {
    // 自动校验是否已经登录
    userApi.checkAuth().then((res) => {
      if (res) {  // 校验成功，直接跳转到账本页面
        navigate(RoutePath.PATH_LEDGER)
      } else {  // 校验失败，跳转回登录页面
        navigate(RoutePath.PATH_LOGIN)
      }
    })
  }, []);

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